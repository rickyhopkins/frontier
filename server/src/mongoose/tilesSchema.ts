import { Schema } from 'mongoose';

export const tilesSchema = new Schema({
    wood: Number,
    stone: Number,
    livestock: Number,
    wheat: Number,
    iron: Number,
});
