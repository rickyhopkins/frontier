import * as React from "react";
import { Units } from "../../@types/frontier";
import { styled } from "linaria/react";
import { useRequiredContext } from "../../hooks/useRequiredContext";
import { GameContext } from "../Game";
import { AuthenticationContext } from "../../contexts/AuthenticationWrapper";

interface IProps {
    unit: Units;
}

const UnitWrapper = styled.div`
    background-color: #1a2b33;
    border-radius: 4px;
`;

export const UnitTile = ({ unit }: IProps) => {
    const { game } = useRequiredContext(GameContext);
    const { user } = useRequiredContext(AuthenticationContext);

    const registration = game.registrations.find(
        ({ player }) => player._id === user._id
    );

    if (!registration) return null;

    return <UnitWrapper>{registration.shoppingCart[unit]}</UnitWrapper>;
};
