import { Document, model, Schema } from "mongoose";
import { IRegistration, registrationSchema } from "./registrationSchema";
import { IPlayer } from "./playerSchema";
import { ITrade, tradeSchema } from "./tradeSchema";
import { IUnits, UnitConsts } from "./unitsSchema";
import { UserInputError } from "apollo-server";

export interface IGame extends Document {
    owner: IPlayer;
    stage: "open" | "tiles" | "turns";
    registrations: IRegistration[];
    trades: ITrade[];
    nextStage(): IGame;
    acceptTrade(tradeId: string, accept: boolean): IGame;
    merchantTrade(
        fromRegistrationId: string,
        tradeValues: ITrade["tradeValues"]
    ): IGame;
    buyUnit(
        fromRegistrationId: string,
        tradeValues: ITrade["tradeValues"]
    ): IGame;
    sellUnit(
        fromRegistrationId: string,
        tradeValues: ITrade["tradeValues"]
    ): IGame;
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

gameSchema.methods.merchantTrade = async function(
    fromRegistrationId,
    tradeValues
) {
    const fromRegistration = this.registrations.find(({ _id }) =>
        _id.equals(fromRegistrationId)
    );

    const enoughResources = Object.entries(tradeValues).every(
        ([resource, value]: [string, number]) => {
            if (value < 0) {
                return fromRegistration.stockpile[resource] >= Math.abs(value);
            }
            return true;
        }
    );

    const isBalanced =
        Object.values(tradeValues).reduce<number>((balance, value: number) => {
            if (value < 0) {
                return balance + value / 4;
            }
            return balance + value;
        }, 0) === 0;

    if (enoughResources && isBalanced) {
        Object.entries(tradeValues).forEach(
            ([resource, value]: [string, number]) => {
                fromRegistration.stockpile[resource] += value;
            }
        );
    }

    await this.save();
    return this;
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

gameSchema.methods.buyUnit = async function(
    registrationId: string,
    unit: keyof IUnits
) {
    const registration = this.registrations.find(({ _id }) =>
        _id.equals(registrationId)
    );
    const unitCost = UnitConsts[unit];
    const enoughResources = Object.entries(unitCost).every(
        ([resource, value]: [string, number]) =>
            registration.stockpile[resource] >= value
    );

    if (!enoughResources) {
        throw new UserInputError(
            `You do not have enough resources to buy a ${unit}`
        );
    }

    registration.shoppingCart[unit] += 1;
    Object.entries(unitCost).forEach(
        ([resource, value]) => (registration.stockpile[resource] -= value)
    );

    await this.save();
    return this;
};

gameSchema.methods.sellUnit = async function(
    registrationId: string,
    unit: keyof IUnits
) {
    const registration = this.registrations.find(({ _id }) =>
        _id.equals(registrationId)
    );
    const unitCost = UnitConsts[unit];

    if (registration.shoppingCart[unit] <= 0) {
        throw new UserInputError(`You do not have a ${unit} to sell`);
    }

    registration.shoppingCart[unit] -= 1;
    Object.entries(unitCost).forEach(
        ([resource, value]) => (registration.stockpile[resource] += value)
    );

    await this.save();
    return this;
};

export const Game = model<IGame>("Game", gameSchema);
