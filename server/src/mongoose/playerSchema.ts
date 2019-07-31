import { Document, model, Schema } from 'mongoose';

export interface IPlayer extends Document {
    name: string;
}

export const playerSchema = new Schema({
    name: String,
});

export const Player = model<IPlayer>('Player', playerSchema);
