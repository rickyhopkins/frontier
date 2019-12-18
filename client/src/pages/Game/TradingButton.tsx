import * as React from "react";
import { useState } from "react";
import { Button, OutlineButton } from "../../components/Button";
import { useRequiredContext } from "../../hooks/useRequiredContext";
import { GameContext } from "../Game";
import { AuthenticationContext } from "../../contexts/AuthenticationWrapper";
import { PurchasingContext } from "./Purchasing";
import {
    MERCHANT_TRADER_ID,
    PurchasingActionTypes,
} from "./Purchasing.reducer";
import { useMutation } from "@apollo/react-hooks";
import { GameMutations } from "../../graphql/mutations";
import { TradingButtonWrapper } from "./TradingButton.styles";

export const TradingButton = () => {
    const [active, setActive] = useState(false);
    const { game, registration } = useRequiredContext(GameContext);
    const { user } = useRequiredContext(AuthenticationContext);
    const { state, dispatch } = useRequiredContext(PurchasingContext);
    const [proposeTradeMutation] = useMutation(GameMutations.PROPOSE_TRADE);

    const isBalanced =
        state.tradingWith !== MERCHANT_TRADER_ID ||
        Object.values(state.trade).reduce<number>((balance, value) => {
            if (!value) return balance;
            if (value < 0) {
                return balance + value / 4;
            }
            return balance + value;
        }, 0) === 0;

    const finaliseTrade = async () => {
        if (!registration) return;

        const res = await proposeTradeMutation({
            variables: {
                code: game.code,
                trade: {
                    values: state.trade,
                    fromRegistrationId: registration._id,
                    toRegistrationId: state.tradingWith,
                },
            },
        });

        if (res.data.proposeTrade) {
            dispatch({
                type: PurchasingActionTypes.SET_TRADING_WITH,
            });
            setActive(false);
        }
    };

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
        <TradingButtonWrapper>
            {active && !state.tradingWith && (
                <>
                    <div>Who do you want to trade with?</div>
                    <OutlineButton onClick={setTradingUser(MERCHANT_TRADER_ID)}>
                        The merchant
                    </OutlineButton>
                    {otherRegistrations.map(({ _id, player }) => (
                        <OutlineButton
                            key={player._id}
                            onClick={setTradingUser(_id)}
                        >
                            {player.name}
                        </OutlineButton>
                    ))}
                </>
            )}
            <OutlineButton
                onClick={toggleActive}
                disabled={registration && !registration.active}
            >
                {active ? "Cancel trade" : "Trade resources"}
            </OutlineButton>
            {state.tradingWith && (
                <Button onClick={finaliseTrade} disabled={!isBalanced}>
                    Propose trade terms
                </Button>
            )}
        </TradingButtonWrapper>
    );
};
