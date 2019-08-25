import * as React from "react";
import { useRequiredContext } from "../../hooks/useRequiredContext";
import { GameContext } from "../Game";
import { Player } from "./Player";
import { styled } from "linaria/react";

const PlayerWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
`;

export const Registrations = () => {
    const { game } = useRequiredContext(GameContext);

    return (
        <PlayerWrapper>
            {game.registrations.map(registration => (
                <Player
                    key={registration._id}
                    registration={registration}
                    state={game.status}
                />
            ))}
        </PlayerWrapper>
    );
};
