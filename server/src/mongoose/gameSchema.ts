import { model, Schema } from 'mongoose';
import { registrationSchema } from './registrationSchema';

export const gameSchema = new Schema({
    code: String,
    status: {
        type: String,
        default: 'open',
        enum: ['open'],
    },
    registrations: [registrationSchema],
});

export const Game = model('Game', gameSchema);
