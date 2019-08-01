import { Document, model, Schema } from 'mongoose';
import { IRegistration, registrationSchema } from './registrationSchema';
import { IPlayer } from './playerSchema';

export interface IGame extends Document {
    owner: IPlayer;
    status: 'open' | 'tile_allocation';
    registrations: IRegistration[];
}

export const gameSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Player',
    },
    code: String,
    status: {
        type: String,
        default: 'open',
        enum: ['open'],
    },
    registrations: {
        type: [registrationSchema],
        validate: [
            registrations => {
                return registrations.length <= 6;
            },
            'Max players reached',
        ],
    },
});

export const Game = model<IGame>('Game', gameSchema);
