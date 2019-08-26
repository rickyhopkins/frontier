import { ITiles } from "../Game";
import { Resources } from "../../@types/frontier";

export const MERCHANT_TRADER_ID = "MERCHANT";

export interface IPurchasingState {
    tradingWith?: string;
    trade: Partial<ITiles>;
}

export enum PurchasingActionTypes {
    SET_TRADING_WITH,
    ADD_TO_TRADE,
}

export type PurchsingActions =
    | {
          type: PurchasingActionTypes.SET_TRADING_WITH;
          tradingWith?: string;
      }
    | { type: PurchasingActionTypes.ADD_TO_TRADE; resource: Resources };

export const PurchasingReducer: React.Reducer<
    IPurchasingState,
    PurchsingActions
> = (state, action) => {
    switch (action.type) {
        case PurchasingActionTypes.SET_TRADING_WITH:
            return { ...state, tradingWith: action.tradingWith, trade: {} };
        case PurchasingActionTypes.ADD_TO_TRADE:
            return {
                ...state,
                trade: {
                    ...state.trade,
                    [action.resource]:
                        (state.trade[action.resource] || 0) +
                        ((state.tradingWith || "") === MERCHANT_TRADER_ID
                            ? 4
                            : 1),
                },
            };
        default:
            return state;
    }
};
