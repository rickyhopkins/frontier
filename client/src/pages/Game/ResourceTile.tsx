import * as React from 'react';
import { styled } from 'linaria/react';
import { motion, Variants } from 'framer-motion';
import { Theme } from '../../styles/Theme';

import iron from '../../assets/images/iron.png';
import livestock from '../../assets/images/livestock.png';
import stone from '../../assets/images/stone.png';
import wheat from '../../assets/images/wheat.png';
import wood from '../../assets/images/wood.png';

const StyledTile = styled(motion.div)`
    border-radius: 4px;
    margin-bottom: 1rem;
    height: 4rem;
    padding: 0 0.75rem;

    img {
        height: 100%;
    }
`;

interface IProps {
    resourceType: 'wood' | 'stone' | 'livestock' | 'wheat' | 'iron';
}

export const ResourceTile = ({ resourceType }: IProps) => {
    const variants: Variants = {
        open: {
            opacity: 0,
            background: 'transparent',
            x: -20,
            display: 'none',
            transition: {
                display: {
                    delay: 0.5,
                },
            },
        },
        tiles: {
            opacity: 1,
            background: Theme.colors.contrast.background,
            x: 0,
            display: 'block',
        },
    };

    const iconSrc = (() => {
        switch (resourceType) {
            case 'iron':
                return iron;
            case 'livestock':
                return livestock;
            case 'stone':
                return stone;
            case 'wheat':
                return wheat;
            case 'wheat':
            default:
                return wood;
        }
    })();

    return (
        <StyledTile
            initial={{
                opacity: 0,
                background: 'transparent',
                x: -20,
                display: 'none',
            }}
            variants={variants}
        >
            <img src={iconSrc} />
            {resourceType}
        </StyledTile>
    );
};
