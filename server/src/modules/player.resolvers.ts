import { Player } from '../mongoose/playerSchema';
import * as jwt from 'jsonwebtoken';

export default {
    Query: {
        async players() {
            return Player.find();
        },
        player(parent, args) {
            return Player.findById(args.id);
        },
    },
    Mutation: {
        async createPlayer(parent, args) {
            const user = await Player.create(args);
            return jwt.sign(
                {
                    user,
                },
                'secrets'
            );
        },
    },
};
