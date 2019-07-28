import { model, Schema } from 'mongoose';

export const playerSchema = new Schema({
    name: String,
});

export const Player = model('Player', playerSchema);
