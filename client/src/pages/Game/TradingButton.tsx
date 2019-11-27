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
import { useMutation } from "@apollo/react-hooks";
import { GameMutations } from "../../graphql/mutations";
import { TradingButtonWrapper } from "./TradingButton.styles";

export const TradingButton = () => {
    const [active, setActive] = useState(false);
    const { game } = useRequiredContext(GameContext);
    const { user } = useRequiredContext(AuthenticationContext);
    const { state, dispatch } = useRequiredContext(PurchasingContext);
    const [proposeTradeMutation] = useMutation(GameMutations.PROPOSE_TRADE);

    const finaliseTrade = () => {
        const myRegistration = game.registrations.find(
            ({ player }) => player._id === user._id
        );

        if (!myRegistration) return;

        proposeTradeMutation({
            variables: {
                code: game.code,
                trade: {
                    values: state.trade,
                    fromRegistrationId: myRegistration._id,
                    toRegistrationId: state.tradingWith,
                },
            },
        });
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
        <>
            <TradingButtonWrapper>
                {active && !state.tradingWith && (
                    <>
                        <div>Who do you want to trade with?</div>
                        <Button onClick={setTradingUser(MERCHANT_TRADER_ID)}>
                            The merchant
                        </Button>
                        {otherRegistrations.map(({ _id, player }) => (
                            <Button
                                key={player._id}
                                onClick={setTradingUser(_id)}
                            >
                                {player.name}
                            </Button>
                        ))}
                    </>
                )}
                <Button onClick={toggleActive}>
                    {active ? "Cancel trade" : "Trade resources"}
                </Button>
                {state.tradingWith && (
                    <Button onClick={finaliseTrade}>Propose trade terms</Button>
                )}
            </TradingButtonWrapper>
        </>
    );
};
