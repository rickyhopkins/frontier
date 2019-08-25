import { Schema } from "mongoose";
import { ITiles, tilesSchema } from "./tilesSchema";
import { IUnits, unitsSchema } from "./unitsSchema";
import { IPlayer } from "./playerSchema";

export interface IRegistration {
    tiles: ITiles;
    stockpile: ITiles;
    shoppingCart: IUnits;
    player: IPlayer;
}

export const registrationSchema = new Schema({
    tiles: tilesSchema,
    stockpile: tilesSchema,
    shoppingCart: unitsSchema,
    player: {
        type: Schema.Types.ObjectId,
        ref: "Player",
    },
});
