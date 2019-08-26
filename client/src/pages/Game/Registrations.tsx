import * as React from "react";
import { useRequiredContext } from "../../hooks/useRequiredContext";
import { GameContext } from "../Game";
import { Player } from "./Player";
import { styled } from "linaria/react";

const PlayerWrapper = styled.div`
    display: flex;
    justify-content: center;
`;

export const Registrations = () => {
    const { game } = useRequiredContext(GameContext);

    if (game.stage === "turns") return null;

    return (
        <PlayerWrapper>
            {game.registrations.map(registration => (
                <Player
                    key={registration._id}
                    registration={registration}
                    state={game.stage}
                />
            ))}
        </PlayerWrapper>
    );
};
