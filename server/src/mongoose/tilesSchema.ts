import { Schema } from 'mongoose';

export interface ITiles {
    wood: Number;
    stone: Number;
    livestock: Number;
    wheat: Number;
    iron: Number;
}

export const tilesSchema = new Schema({
    wood: Number,
    stone: Number,
    livestock: Number,
    wheat: Number,
    iron: Number,
});
