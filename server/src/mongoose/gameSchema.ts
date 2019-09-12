import { Document, Model, model, Schema } from "mongoose";
import { IRegistration, registrationSchema } from "./registrationSchema";
import { IPlayer } from "./playerSchema";
import { ITrade, tradeSchema } from "./tradeSchema";

export interface IGame extends Document {
    owner: IPlayer;
    stage: "open" | "tiles" | "turns";
    registrations: IRegistration[];
    trades: ITrade[];
    nextStage(): IGame;
}

export const gameSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "Player",
    },
    code: { type: String, index: true },
    stage: {
        type: String,
        default: "open",
        enum: ["open", "tiles", "turns"],
    },
    registrations: {
        type: [registrationSchema],
        validate: [
            registrations => {
                return registrations.length <= 6;
            },
            "Max players reached",
        ],
    },
    trades: [tradeSchema],
});

gameSchema.methods.nextStage = async function() {
    switch (this.stage) {
        case "open":
            return this.constructor.findByIdAndUpdate(
                this._id,
                {
                    $set: { stage: "tiles" },
                },
                { new: true }
            );
        case "tiles":
            const g = await this.constructor.findById(this._id);
            g.stage = "turns";
            g.registrations.forEach(r => {
                Object.keys(r.stockpile).forEach(resource => {
                    r.stockpile[resource] += r.tiles[resource];
                });
            });
            await g.save();
            return g;
        case "turns":
            return this.constructor.findByIdAndUpdate(
                this._id,
                {
                    $set: { stage: "tiles" },
                },
                { new: true }
            );
    }
    return this;
};

export const Game = model<IGame>("Game", gameSchema);
