import * as React from "react";
import { createContext, Dispatch, useReducer } from "react";
import { useRequiredContext } from "../../hooks/useRequiredContext";
import { GameContext } from "../Game";
import { styled } from "linaria/react";
import { Resources } from "../../@types/frontier";
import { StockpileTile } from "./StockpileTile";
import { TradingButton } from "./TradingButton";
import {
    IPurchasingState,
    PurchasingReducer,
    PurchsingActions,
} from "./Purchasing.reducer";

const PurchasingWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const StockpileWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 1rem;
`;

export const PurchasingContext = createContext<
    | { state: IPurchasingState; dispatch: Dispatch<PurchsingActions> }
    | undefined
>(undefined);

export const Purchasing = () => {
    const [state, dispatch] = useReducer(PurchasingReducer, {
        trade: {},
    });

    const { game } = useRequiredContext(GameContext);

    if (game.stage !== "turns") return null;

    return (
        <PurchasingContext.Provider value={{ state, dispatch }}>
            <PurchasingWrapper>
                <StockpileWrapper>
                    {Object.values(Resources).map(resource => (
                        <StockpileTile key={resource} resource={resource} />
                    ))}
                </StockpileWrapper>
                <TradingButton />
            </PurchasingWrapper>
        </PurchasingContext.Provider>
    );
};
