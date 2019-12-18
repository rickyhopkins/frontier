import { IRegistration, Registration } from "../mongoose/registrationSchema";
import { Game } from "../mongoose/gameSchema";
import { ForbiddenError, UserInputError } from "apollo-server-errors";
import { PubSub, withFilter } from "graphql-subscriptions";
import { Document } from "mongoose";
import { Player } from "../mongoose/playerSchema";

export const REGISTRATION_UPDATED = Symbol("REGISTRATION_UPDATED");

export const publishRegistration = (
    registrationUpdated: IRegistration & Document,
    injector: any
) => {
    injector.get(PubSub).publish(REGISTRATION_UPDATED, { registrationUpdated });
};

export default {
    Subscription: {
        registrationUpdated: {
            subscribe: withFilter(
                (root, args, { injector }) =>
                    injector.get(PubSub).asyncIterator([REGISTRATION_UPDATED]),
                ({ registrationUpdated }, { gameId }) =>
                    registrationUpdated.game.equals(gameId)
            ),
        },
    },
    Query: {
        async registration(parent, args) {
            return Registration.findById(args.id);
        },
    },
    Mutation: {
        async register(parent, args, { injector }, { session }) {
            const game = await Game.findOne({ code: args.code }).populate(
                "registrations"
            );
            if (game.stage !== "open") {
                throw new UserInputError(
                    "This game has already started and you can no longer join it"
                );
            }
            if (game.registrations.length >= 6) {
                throw new UserInputError("This game is full");
            }

            const registration = await Registration.findOneAndUpdate(
                { player: session.user, game },
                {},
                { upsert: true, setDefaultsOnInsert: true, new: true }
            );

            publishRegistration(registration, injector);

            return registration;
        },
        async addResource(parent, args, { injector }, { session }) {
            const { game } = (await Registration.findById(
                args.registrationId
            ).populate("game")) as any;

            if (!game.owner.equals(session.user._id)) {
                throw new ForbiddenError("You are not the game owner");
            }

            const registration = await Registration.findByIdAndUpdate(
                args.registrationId,
                {
                    $inc: {
                        [`tiles.${args.resource}`]: args.value,
                    },
                },
                { new: true, runValidators: true }
            );

            publishRegistration(registration, injector);

            return registration;
        },
        async buyUnit(parent, args, { injector }) {
            const registration = await Registration.findById(
                args.registrationId
            );

            return registration.buyUnit(args.unit).save();
        },
        async sellUnit(parent, args, { injector }) {
            const registration = await Registration.findById(
                args.registrationId
            );

            return registration.sellUnit(args.unit).save();
        },
        async endTurn(parent, args, { injector }, { session }) {
            const registration = await Registration.findOneAndUpdate(
                {
                    player: session.user,
                },
                {
                    $set: {
                        active: false,
                    },
                },
                { new: true, runValidators: true }
            );

            publishRegistration(registration, injector);

            return registration;
        },
    },
    Game: {
        registrations: async game => Registration.find({ game }),
    },
    Registration: {
        player: ({ player }) => {
            return Player.findById(player);
        },
    },
} as any;
