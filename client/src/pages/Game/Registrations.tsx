import * as React from 'react';
import { useRequiredContext } from '../../hooks/useRequiredContext';
import { GameContext } from '../Game';

export const Registrations = () => {
    const { game } = useRequiredContext(GameContext);

    return (
        <div>
            {game.registrations.map(({ _id, player }) => (
                <div key={_id}>{player.name}</div>
            ))}
        </div>
    );
};
