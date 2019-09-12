import { Schema } from "mongoose";
import { IPlayer } from "./playerSchema";
import { ITiles } from "./registrationSchema";

export interface ITrade {
    tradeValues: ITiles;
    fromRegistration: string;
    toRegistration: string;
    outcome: "pending" | "declined" | "accepted";
}

export const tradeSchema = new Schema({
    tradeValues: {
        wood: Number,
        stone: Number,
        livestock: Number,
        wheat: Number,
        iron: Number,
    },
    fromRegistration: String,
    toRegistration: String,
    outcome: {
        type: String,
        default: "pending",
        enum: ["pending", "declined", "accepted"],
    },
});
