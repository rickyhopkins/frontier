import * as React from "react";
import { useRequiredContext } from "../../hooks/useRequiredContext";
import { GameContext } from "../Game";

export const TurnButton = () => {
    const { registration } = useRequiredContext(GameContext);

    if (!registration || !registration.active) return null;

    return <div>EndTurn</div>;
};
