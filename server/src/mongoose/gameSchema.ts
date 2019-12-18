import { Document, model, Schema } from "mongoose";
import { IRegistration, Registration } from "./registrationSchema";
import { IPlayer } from "./playerSchema";
import { ITrade, tradeSchema } from "./tradeSchema";

export interface IGame extends Document {
    owner: IPlayer;
    stage: "open" | "tiles" | "turns";
    registrations: IRegistration[];
    trades: ITrade[];
    nextStage(): IGame;
    acceptTrade(tradeId: string, accept: boolean): IGame;
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
    trades: [tradeSchema],
});

gameSchema.virtual("registrations", {
    ref: "Registration",
    localField: "_id",
    foreignField: "game",
    justOne: false,
});

gameSchema.methods.nextStage = async function() {
    switch (this.stage) {
        case "open":
            this.stage = "tiles";
            break;
        case "tiles":
            const registrations = await Registration.find({ game: this });

            registrations.map(registration => registration.beginTurn());

            this.stage = "turns";
            break;
        case "turns":
            this.stage = "tiles";
    }

    await this.save();
};

gameSchema.methods.acceptTrade = async function(
    tradeId: string,
    accept: boolean
) {
    const trade = this.trades.find(({ _id }) => _id.equals(tradeId));

    if (!accept) {
        trade.outcome = "declined";
        await this.save();
        return this;
    }

    const fromRegistration = this.registrations.find(({ _id }) =>
        _id.equals(trade.fromRegistration)
    );
    const toRegistration = this.registrations.find(({ _id }) =>
        _id.equals(trade.toRegistration)
    );

    const enoughResources = Object.entries(trade.tradeValues.toJSON()).every(
        ([resource, value]: [string, number]) => {
            if (value < 0) {
                return fromRegistration.stockpile[resource] >= Math.abs(value);
            }
            return toRegistration.stockpile[resource] >= value;
        }
    );

    if (!enoughResources) {
        trade.outcome = "insufficient-resources";
    } else {
        trade.outcome = "accepted";
        Object.entries(trade.tradeValues.toJSON()).forEach(
            ([resource, value]: [string, number]) => {
                fromRegistration.stockpile[resource] += value;
                toRegistration.stockpile[resource] -= value;
            }
        );
    }

    await this.save();
    return this;
};

export const Game = model<IGame>("Game", gameSchema);
