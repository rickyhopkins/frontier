import { Document, model, Schema } from "mongoose";
import { IUnits, UnitConsts } from "./unitsSchema";
import { IPlayer } from "./playerSchema";
import { UserInputError } from "apollo-server-errors";
import { ITrade } from "./tradeSchema";
import { gameSchema } from "./gameSchema";

export interface ITiles {
    wood: number;
    stone: number;
    livestock: number;
    wheat: number;
    iron: number;
}

export interface IRegistration extends Document {
    tiles: ITiles;
    stockpile: ITiles;
    shoppingCart: IUnits;
    player: IPlayer;
    active: boolean;

    // Methods
    buyUnit: (unit: keyof IUnits) => IRegistration;
    sellUnit: (unit: keyof IUnits) => IRegistration;
    beginTurn: () => void;
    merchantTrade: (tradeValues: ITrade["tradeValues"]) => IRegistration;
}

const minNumber = { type: Number, min: 0, default: 0 };

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
    shoppingCart: {
        soldier: minNumber,
        horseman: minNumber,
        cannon: minNumber,
        ship: minNumber,
        settler: minNumber,
        city: minNumber,
        road: minNumber,
        wall: minNumber,
    },
    player: {
        type: Schema.Types.ObjectId,
        ref: "Player",
    },
    game: {
        type: Schema.Types.ObjectId,
        ref: "Game",
    },
    active: { type: Boolean, default: true },
});

registrationSchema.methods.buyUnit = function(unit: keyof IUnits) {
    const unitCost = UnitConsts[unit];
    const enoughResources = Object.entries(unitCost).every(
        ([resource, value]: [string, number]) =>
            this.stockpile[resource] >= value
    );

    if (!enoughResources) {
        throw new UserInputError(
            `You do not have enough resources to buy a ${unit}`
        );
    }

    this.shoppingCart[unit] += 1;
    Object.entries(unitCost).forEach(
        ([resource, value]) => (this.stockpile[resource] -= value)
    );
    return this;
};

registrationSchema.methods.sellUnit = function(unit: keyof IUnits) {
    const unitCost = UnitConsts[unit];

    if (this.shoppingCart[unit] <= 0) {
        throw new UserInputError(`You do not have a ${unit} to sell`);
    }

    this.shoppingCart[unit] -= 1;
    Object.entries(unitCost).forEach(
        ([resource, value]) => (this.stockpile[resource] += value)
    );
    return this;
};

registrationSchema.methods.beginTurn = function() {
    Object.keys(this.stockpile).forEach(resource => {
        this.stockpile[resource] += this.tiles[resource];
    });
    this.shoppingCart = undefined;
    this.active = true;
    this.save();
};

registrationSchema.methods.merchantTrade = async function(tradeValues) {
    const enoughResources = Object.entries(tradeValues).every(
        ([resource, value]: [string, number]) => {
            if (value < 0) {
                return this.stockpile[resource] >= Math.abs(value);
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
                this.stockpile[resource] += value;
            }
        );
    }

    await this.save();
    return this;
};
export const Registration = model<IRegistration>(
    "Registration",
    registrationSchema
);
