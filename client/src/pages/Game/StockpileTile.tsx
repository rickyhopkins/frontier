import * as React from "react";
import { useRequiredContext } from "../../hooks/useRequiredContext";
import { GameContext } from "../Game";
import { AuthenticationContext } from "../../contexts/AuthenticationWrapper";
import { Resources } from "../../@types/frontier";
import { styled } from "linaria/react";
import iron from "../../assets/images/iron.png";
import livestock from "../../assets/images/livestock.png";
import stone from "../../assets/images/stone.png";
import wheat from "../../assets/images/wheat.png";
import wood from "../../assets/images/wood.png";
import { Theme } from "../../styles/Theme";
import {
    MERCHANT_TRADER_ID,
    PurchasingActionTypes,
} from "./Purchasing.reducer";
import { PurchasingContext } from "./Purchasing";
import { css, cx } from "linaria";

interface IProps {
    resource: Resources;
}

const Tile = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    align-items: center;
    background-color: ${Theme.colors.contrast.background};
    margin: 0.25rem;
    border-radius: 4px;

    span {
        color: #fff;
        font-size: 1.1rem;
    }

    img {
        height: 3rem;
    }
`;

const DisabledTile = css`
    opacity: 0.5;
`;

export const StockpileTile = ({ resource }: IProps) => {
    const { game } = useRequiredContext(GameContext);
    const { user } = useRequiredContext(AuthenticationContext);
    const { state, dispatch } = useRequiredContext(PurchasingContext);
    const registration = game.registrations.find(
        ({ player }) => player._id === user._id
    );

    if (!registration) return null;

    const iconSrc = (() => {
        switch (resource) {
            case "iron":
                return iron;
            case "livestock":
                return livestock;
            case "stone":
                return stone;
            case "wheat":
                return wheat;
            case "wood":
            default:
                return wood;
        }
    })();

    const onClick = () => {
        dispatch({ type: PurchasingActionTypes.ADD_TO_TRADE, resource });
    };

    const resourceCount =
        registration.stockpile[resource] - (state.trade[resource] || 0);

    const disabled =
        state.tradingWith &&
        resourceCount < (state.tradingWith === MERCHANT_TRADER_ID ? 4 : 1);

    return (
        <Tile
            onClick={disabled ? undefined : onClick}
            className={cx(disabled && DisabledTile)}
        >
            <img src={iconSrc} alt={resource} />
            <span>{resourceCount}</span>
        </Tile>
    );
};
