import { ITiles } from "./registrationSchema";

export interface IUnits {
    soldier: Number;
    horseman: Number;
    cannon: Number;
    ship: Number;
    settler: Number;
    city: Number;
    road: Number;
    wall: Number;
}

export const UnitConsts: Record<keyof IUnits, Partial<ITiles>> = {
    soldier: { wood: 1, livestock: 1, wheat: 2, iron: 1 },
    horseman: { wood: 1, livestock: 2, wheat: 3, iron: 1 },
    cannon: { wood: 3, iron: 5 },
    ship: { wood: 4, stone: 1, livestock: 1, wheat: 1, iron: 5 },
    settler: { wood: 2, stone: 2, livestock: 3, wheat: 2 },
    city: { wood: 4, stone: 4, livestock: 3, wheat: 4, iron: 2 },
    road: { stone: 3 },
    wall: { stone: 4 },
};
