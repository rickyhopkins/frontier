import * as React from 'react';
import { useRequiredContext } from '../../hooks/useRequiredContext';
import { GameContext } from '../Game';
import { Player } from './Player';
import { styled } from 'linaria/react';
import { motion, Variants } from 'framer-motion';
import { useState } from 'react';

const PlayerWrapper = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
`;

export const Registrations = () => {
    const { game } = useRequiredContext(GameContext);
    const [state, setState] = useState('open');

    const variants: Variants = {
        open: { transition: { staggerChildren: 0.2 } },
        tiles: { transition: { staggerChildren: 0.1 } },
    };

    return (
        <>
            <PlayerWrapper variants={variants} animate={state}>
                {game.registrations.map(({ _id, player }) => (
                    <Player key={_id} player={player} state={state} />
                ))}
            </PlayerWrapper>
            <div
                onClick={() =>
                    setState(oldState =>
                        oldState === 'tiles' ? 'open' : 'tiles'
                    )
                }
            >
                Click me
            </div>
        </>
    );
};
