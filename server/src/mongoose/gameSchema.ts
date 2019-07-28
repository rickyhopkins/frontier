import { model, Schema } from 'mongoose';
import { playerSchema } from './playerSchema';
import { registrationSchema } from './registrationSchema';

export const gameSchema = new Schema({
    code: String,
    registrations: [registrationSchema],
});

export const Game = model('Game', gameSchema);
