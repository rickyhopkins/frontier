import { model, Schema } from 'mongoose';
import { registrationSchema } from './registrationSchema';

export const gameSchema = new Schema({
    code: String,
    registrations: [registrationSchema],
});

export const Game = model('Game', gameSchema);
