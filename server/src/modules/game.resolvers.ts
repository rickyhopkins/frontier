import { Game } from '../mongoose/gameSchema';
import * as crypto from 'crypto';
import { Player } from '../mongoose/playerSchema';
import { PubSub } from 'graphql-subscriptions';

const GAME_ADDED = 'GAME_ADDED';

const randomString = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    const charsLength = chars.length;

    const randomBytes = crypto.randomBytes(4);
    const { code } = new Array(4).fill(null).reduce(
        (acc, _, i) => {
            const cursor = acc.cursor + randomBytes[i];
            const code = acc.code + chars[cursor % charsLength];
            return { code, cursor };
        },
        { code: '', cursor: 0 }
    );

    return code;
};

export default {
    Subscription: {
        gameAdded: {
            subscribe(root, args, { injector }) {
                return injector.get(PubSub).asyncIterator([GAME_ADDED]);
            },
        },
    },
    Query: {
        async games() {
            return Game.find();
        },
        game(parent, args) {
            return Game.findById(args.id);
        },
    },
    Mutation: {
        async createGame(parent, args, { injector }, { session }) {
            const game = await Game.create({
                ...args,
                code: randomString(),
                registrations: [{ player: session.user }],
            });
            injector.get(PubSub).publish(GAME_ADDED, { gameAdded: game });
            return game;
        },
    },
    Registration: {
        player: ({ player }) => {
            return Player.findById(player);
        },
    },
} as any;
