import * as React from "react";
import { createContext, Dispatch, useReducer } from "react";
import { useRequiredContext } from "../../hooks/useRequiredContext";
import { GameContext } from "../Game";
import { styled } from "linaria/react";
import { TradingButton } from "./TradingButton";
import {
    IPurchasingState,
    MERCHANT_TRADER_ID,
    PurchasingReducer,
    PurchsingActions,
} from "./Purchasing.reducer";
import { Stockpile } from "./Stockpile";
import { AuthenticationContext } from "../../contexts/AuthenticationWrapper";
import { Resources, Units } from "../../@types/frontier";
import { css, cx } from "linaria";
import { TradingTile } from "./TradingTile";
import { UnitTile } from "./UnitTile";

const PurchasingWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const StockpileWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
`;

const UnitWrapper = styled.div`
    display: grid;
    grid-gap: 1rem;
`;

const TradingWrapper = css`
    grid-auto-flow: column;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(5, 1fr);
    column-gap: 1rem;
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
        ({ _id }) => _id === state.tradingWith
    );

    if (game.stage !== "turns" || !registration) return null;

    return (
        <PurchasingContext.Provider value={{ state, dispatch }}>
            <PurchasingWrapper>
                <h3>Resources available</h3>
                <StockpileWrapper
                    className={cx(state.tradingWith && TradingWrapper)}
                >
                    <Stockpile
                        stockpile={registration.stockpile}
                        isCurrentUser
                    />
                    {Object.values(Resources).map((resource: Resources) => (
                        <TradingTile
                            key={resource}
                            value={state.trade[resource]}
                        />
                    ))}
                    {tradersRegistration && (
                        <Stockpile stockpile={tradersRegistration.stockpile} />
                    )}
                    {state.tradingWith === MERCHANT_TRADER_ID && (
                        <Stockpile isMerchant />
                    )}
                </StockpileWrapper>
                <TradingButton />
                <h3>Shopping cart</h3>
                <UnitWrapper>
                    {Object.values(Units).map(unit => (
                        <UnitTile key={unit} unit={unit} />
                    ))}
                </UnitWrapper>
            </PurchasingWrapper>
        </PurchasingContext.Provider>
    );
};
