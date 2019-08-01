import * as React from 'react';
import { useRequiredContext } from '../../hooks/useRequiredContext';
import { GameContext } from '../Game';
import { styled } from 'linaria/react';

export const ContextMenuWrapper = styled.div`
    text-align: center;
`;

export const ContextMenu = () => {
    const { game } = useRequiredContext(GameContext);

    return (
        <ContextMenuWrapper>
            Game code: <div>{game.code}</div>
        </ContextMenuWrapper>
    );
};
