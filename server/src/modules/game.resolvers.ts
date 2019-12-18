import { Game, IGame } from "../mongoose/gameSchema";
import * as crypto from "crypto";
import { Player } from "../mongoose/playerSchema";
import { PubSub, withFilter } from "graphql-subscriptions";
import { Registration } from "../mongoose/registrationSchema";
import { publishRegistration } from "./registration.resolvers";

export const GAME_UPDATED = Symbol("GAME_UPDATED");

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

export const publishGame = (game: IGame, injector: any) => {
    injector.get(PubSub).publish(GAME_UPDATED, { gameUpdated: game });
};

export default {
    Subscription: {
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
            const game = await Game.create({
                ...args,
                owner: session.user,
                code: randomString(),
            });

            await Registration.create({
                player: session.user,
                game: game,
            });

            return game;
        },
        async nextStage(parent, args, { injector }) {
            const game = await Game.findOne({ code: args.code });

            await game.nextStage();

            publishGame(game, injector);

            return game;
        },
        async proposeTrade(parent, args, { injector }, { session }) {
            const { code, trade } = args;
            if (trade.toRegistrationId === "MERCHANT") {
                const registration = await Registration.findOne({
                    player: session.user,
                });

                await registration.merchantTrade(trade.values);

                await publishRegistration(registration, injector);

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

            await publishGame(game, injector);

            return true;
        },
        async acceptTrade(parent, args, { injector }) {
            const game = await Game.findOne({ code: args.code });

            const updatedGame = await game.acceptTrade(args.tradeId, true);

            await publishGame(updatedGame, injector);

            return true;
        },
        async rejectTrade(parent, args, { injector }) {
            const game = await Game.findOne({ code: args.code });

            const updatedGame = await game.acceptTrade(args.tradeId, false);

            await publishGame(updatedGame, injector);

            return true;
        },
    },
} as any;
