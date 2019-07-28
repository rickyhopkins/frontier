import { Game } from '../mongoose/gameSchema';
import * as crypto from 'crypto';

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
    Query: {
        async games() {
            return Game.find();
        },
        game(parent, args) {
            return Game.findById(args.id);
        },
    },
    Mutation: {
        async createGame(parent, args) {
            return await Game.create({
                ...args,
                code: randomString(),
                registrations: [{}],
            });
        },
    },
};
