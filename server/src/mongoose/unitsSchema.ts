import { Schema } from 'mongoose';

export const unitsSchema = new Schema({
    soldier: Number,
    horseman: Number,
    cannon: Number,
    ship: Number,
    settler: Number,
    city: Number,
    road: Number,
    wall: Number,
});
