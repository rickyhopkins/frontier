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
import { PurchasingActionTypes } from "./Purchasing.reducer";
import { PurchasingContext } from "./Purchasing";

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

    return (
        <Tile onClick={state.tradingWith ? onClick : undefined}>
            <img src={iconSrc} alt={resource} />
            <span>
                {registration.stockpile[resource] -
                    (state.trade[resource] || 0)}
            </span>
        </Tile>
    );
};
