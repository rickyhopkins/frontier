import { Schema } from "mongoose";
import { IUnits, unitsSchema } from "./unitsSchema";
import { IPlayer } from "./playerSchema";

export interface ITiles {
    wood: number;
    stone: number;
    livestock: number;
    wheat: number;
    iron: number;
}

export interface IRegistration {
    tiles: ITiles;
    stockpile: ITiles;
    shoppingCart: IUnits;
    player: IPlayer;
}

const minNumber = { type: Number, min: 0 };

const tiles = {
    wood: minNumber,
    stone: minNumber,
    livestock: minNumber,
    wheat: minNumber,
    iron: minNumber,
};

export const registrationSchema = new Schema({
    tiles,
    stockpile: tiles,
    shoppingCart: unitsSchema,
    player: {
        type: Schema.Types.ObjectId,
        ref: "Player",
    },
});
