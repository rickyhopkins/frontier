import * as React from 'react';
import { Button } from '../../components/Button';
import { useRequiredContext } from '../../hooks/useRequiredContext';
import { GameContext } from '../Game';
import { AuthenticationContext } from '../../contexts/AuthenticationWrapper';
import { useMutation } from '@apollo/react-hooks';
import { GameMutations } from '../../graphql/mutations';

export const GameActions = () => {
    const { game } = useRequiredContext(GameContext);
    const { user } = useRequiredContext(AuthenticationContext);

    const [register] = useMutation(GameMutations.REGISTER, {
        variables: { code: game.code },
    });

    const canRegister =
        game.registrations.length < 6 &&
        !game.registrations.some(({ player }) => player._id === user._id);

    const isOwner = game.owner._id === user._id;

    const canStart = game.registrations.length > 1;

    return (
        <div>
            {canRegister && (
                <Button onClick={() => register()}>Join game</Button>
            )}
            {isOwner && (
                <Button onClick={() => register()} disabled={!canStart}>
                    {canStart ? 'Start game' : 'Waiting for one more player'}
                </Button>
            )}
        </div>
    );
};
