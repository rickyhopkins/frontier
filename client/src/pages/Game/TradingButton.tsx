import * as React from "react";
import { useState } from "react";
import { Button } from "../../components/Button";
import { useRequiredContext } from "../../hooks/useRequiredContext";
import { GameContext } from "../Game";
import { AuthenticationContext } from "../../contexts/AuthenticationWrapper";
import { PurchasingContext } from "./Purchasing";
import {
    MERCHANT_TRADER_ID,
    PurchasingActionTypes,
} from "./Purchasing.reducer";
import { AnimateOut } from "../../styles/AnimateOut";

export const TradingButton = () => {
    const [active, setActive] = useState(false);
    const { game } = useRequiredContext(GameContext);
    const { user } = useRequiredContext(AuthenticationContext);
    const { state, dispatch } = useRequiredContext(PurchasingContext);

    const setTradingUser = (tradingWith: string) => () => {
        dispatch({
            type: PurchasingActionTypes.SET_TRADING_WITH,
            tradingWith,
        });
    };

    const otherRegistrations = game.registrations.filter(
        ({ player }) => player._id !== user._id
    );

    const toggleActive = () => {
        dispatch({
            type: PurchasingActionTypes.SET_TRADING_WITH,
            tradingWith: undefined,
        });
        setActive(currentlyActive => !currentlyActive);
    };

    return (
        <>
            <AnimateOut active={active && !state.tradingWith}>
                <div>Who do you want to trade with?</div>
                <Button onClick={setTradingUser(MERCHANT_TRADER_ID)}>
                    The merchant
                </Button>
                {otherRegistrations.map(({ player }) => (
                    <Button
                        key={player._id}
                        onClick={setTradingUser(player._id)}
                    >
                        {player.name}
                    </Button>
                ))}
            </AnimateOut>
            <Button onClick={toggleActive}>
                {active ? "Finished trading" : "Trade resources"}
            </Button>
        </>
    );
};
