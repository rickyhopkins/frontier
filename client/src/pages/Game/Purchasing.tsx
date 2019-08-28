import * as React from "react";
import { createContext, Dispatch, useReducer } from "react";
import { useRequiredContext } from "../../hooks/useRequiredContext";
import { GameContext } from "../Game";
import { styled } from "linaria/react";
import { TradingButton } from "./TradingButton";
import {
    IPurchasingState,
    PurchasingReducer,
    PurchsingActions,
} from "./Purchasing.reducer";
import { AnimateOut } from "../../styles/AnimateOut";
import { Stockpile } from "./Stockpile";
import { AuthenticationContext } from "../../contexts/AuthenticationWrapper";
import { Resources } from "../../@types/frontier";

const PurchasingWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const PurchasingContext = createContext<
    | { state: IPurchasingState; dispatch: Dispatch<PurchsingActions> }
    | undefined
>(undefined);

export const Purchasing = () => {
    const { game } = useRequiredContext(GameContext);
    const { user } = useRequiredContext(AuthenticationContext);

    const [state, dispatch] = useReducer(PurchasingReducer, {
        trade: {},
    });

    const registration = game.registrations.find(
        ({ player }) => player._id === user._id
    );

    const tradersRegistration = game.registrations.find(
        ({ player }) => player._id === state.tradingWith
    );

    if (game.stage !== "turns" || !registration) return null;

    return (
        <PurchasingContext.Provider value={{ state, dispatch }}>
            <PurchasingWrapper>
                <Stockpile stockpile={registration.stockpile} isCurrentUser />
                <div style={{ display: "flex" }}>
                    {Object.values(Resources).map((resource: Resources) => (
                        <div key={resource}>{state.trade[resource]}</div>
                    ))}
                </div>
                <AnimateOut active={!!state.tradingWith}>
                    {tradersRegistration && (
                        <Stockpile stockpile={tradersRegistration.stockpile} />
                    )}
                </AnimateOut>
                <TradingButton />
            </PurchasingWrapper>
        </PurchasingContext.Provider>
    );
};
