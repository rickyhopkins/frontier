import { Schema } from 'mongoose';
import { tilesSchema } from './tilesSchema';
import { unitsSchema } from './unitsSchema';

export const registrationSchema = new Schema({
    tiles: tilesSchema,
    stockpile: tilesSchema,
    shoppingCart: unitsSchema,
    player: {
        type: Schema.Types.ObjectId,
        ref: 'Player',
    },
});
