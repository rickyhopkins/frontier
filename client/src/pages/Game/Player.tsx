import * as React from 'react';
import { IUser } from '../../contexts/AuthenticationWrapper';
import { styled } from 'linaria/react';
import { Theme } from '../../styles/Theme';
import { motion, Variants } from 'framer-motion';
import { ResourceTile } from './ResourceTile';
import { transparentize } from 'polished';

interface IProps {
    player: IUser;
    state: string;
}

const PlayerWrapper = styled(motion.div)`
    padding: 1rem;
    background-color: ${Theme.colors.contrast.background};
    border-radius: 4px;
`;

export const Player = ({ player, state }: IProps) => {
    const variants: Variants = {
        open: {
            opacity: 1,
            background: Theme.colors.contrast.background,
            transition: { staggerChildren: 0.1, when: 'afterChildren' },
        },
        tiles: {
            background: transparentize(1, Theme.colors.contrast.background),
            transition: { staggerChildren: 0.1, when: 'beforeChildren' },
        },
    };

    return (
        <PlayerWrapper
            initial={{ opacity: 0, y: -20 }}
            variants={variants}
            positionTransition={true}
        >
            <div>{player.name}</div>
            <ResourceTile resourceType={'wood'} />
            <ResourceTile resourceType={'stone'} />
            <ResourceTile resourceType={'livestock'} />
            <ResourceTile resourceType={'wheat'} />
            <ResourceTile resourceType={'iron'} />
        </PlayerWrapper>
    );
};
