import { Game, IGame } from "../mongoose/gameSchema";
import * as crypto from "crypto";
import { Player } from "../mongoose/playerSchema";
import { PubSub, withFilter } from "graphql-subscriptions";
import { UserInputError } from "apollo-server";
import { IRegistration, ITiles } from "../mongoose/registrationSchema";

const GAME_ADDED = "GAME_ADDED";
const GAME_UPDATED = "GAME_UPDATED";

const randomString = () => {
    const chars = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";

    const charsLength = chars.length;

    const randomBytes = crypto.randomBytes(4);
    const { code } = new Array(4).fill(null).reduce(
        (acc, _, i) => {
            const cursor = acc.cursor + randomBytes[i];
            const code = acc.code + chars[cursor % charsLength];
            return { code, cursor };
        },
        { code: "", cursor: 0 }
    );

    return code;
};

const basicTiles: ITiles = {
    wood: 0,
    stone: 0,
    livestock: 0,
    wheat: 0,
    iron: 0,
};

const basicRegistration: Omit<IRegistration, "player"> = {
    tiles: basicTiles,
    stockpile: basicTiles,
    shoppingCart: {
        settler: 0,
        soldier: 0,
        horseman: 0,
        cannon: 0,
        ship: 0,
        city: 0,
        road: 0,
        wall: 0,
    },
    active: true,
};

const saveAndPublish = (game: IGame, injector: any) => {
    publish(game, injector);
    return game.save();
};

const publish = (game: IGame, injector: any) => {
    injector.get(PubSub).publish(GAME_UPDATED, { gameUpdated: game });
};

export default {
    Subscription: {
        gameAdded: {
            subscribe(root, args, { injector }) {
                return injector.get(PubSub).asyncIterator([GAME_ADDED]);
            },
        },
        gameUpdated: {
            subscribe: withFilter(
                (root, args, { injector }) =>
                    injector.get(PubSub).asyncIterator([GAME_UPDATED]),
                ({ gameUpdated }, { code }) => gameUpdated.code === code
            ),
        },
    },
    Query: {
        games() {
            return Game.find();
        },
        game(parent, { code }) {
            return Game.findOne({ code });
        },
        findOpenGame(parent, { code }) {
            return Game.findOne({ stage: "open", code });
        },
    },
    Mutation: {
        async createGame(parent, args, { injector }, { session }) {
            return Game.create({
                ...args,
                owner: session.user,
                code: randomString(),
                registrations: [{ player: session.user, ...basicRegistration }],
            });
        },
        async register(parent, args, { injector }, { session }) {
            const game = await Game.findOne({ code: args.code });
            if (
                game.registrations.some(
                    ({ player }) =>
                        player.toString() === session.user._id.toString()
                )
            ) {
                return true;
            }
            if (game.stage !== "open") {
                throw new UserInputError(
                    "This game has already started and you can no longer join it"
                );
            }
            if (game.registrations.length >= 6) {
                throw new UserInputError("This game is full");
            }
            game.registrations = [
                ...game.registrations,
                { player: session.user, ...basicRegistration },
            ];

            await saveAndPublish(game, injector);

            return true;
        },
        async addResource(parent, args, { injector }, { session }) {
            const game = await Game.findOneAndUpdate(
                { code: args.code, "registrations._id": args.registrationId },
                {
                    $inc: {
                        [`registrations.$.tiles.${args.resource}`]: args.value,
                    },
                },
                { new: true, runValidators: true }
            );

            await publish(game, injector);

            return true;
        },
        async nextStage(parent, args, { injector }, { session }) {
            const game = await Game.findOne({ code: args.code });

            const t = await game.nextStage();

            await publish(t, injector);

            return true;
        },
        async proposeTrade(parent, args, { injector }, { session }) {
            const { code, trade } = args;
            if (trade.toRegistrationId === "MERCHANT") {
                const game = await Game.findOne({ code: args.code });
                game.merchantTrade(trade.fromRegistrationId, trade.values);

                await publish(game, injector);

                return true;
            }
            const game = await Game.findOneAndUpdate(
                { code: code },
                {
                    $push: {
                        trades: {
                            tradeValues: trade.values,
                            fromRegistration: trade.fromRegistrationId,
                            toRegistration: trade.toRegistrationId,
                        },
                    },
                },
                { new: true, runValidators: true }
            );

            await publish(game, injector);

            return true;
        },
        async acceptTrade(parent, args, { injector }) {
            const game = await Game.findOne({ code: args.code });

            const updatedGame = await game.acceptTrade(args.tradeId, true);

            await publish(updatedGame, injector);

            return true;
        },
        async rejectTrade(parent, args, { injector }) {
            const game = await Game.findOne({ code: args.code });

            const updatedGame = await game.acceptTrade(args.tradeId, false);

            await publish(updatedGame, injector);

            return true;
        },
    },
    Registration: {
        player: ({ player }) => {
            return Player.findById(player);
        },
    },
} as any;
