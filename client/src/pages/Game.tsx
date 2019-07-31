import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useMutation, useQuery, useSubscription } from '@apollo/react-hooks';
import { GAME_UPDATED } from '../graphql/game-updated';
import { FIND_GAME } from '../graphql/find-game';
import { createContext, useState } from 'react';
import { Registrations } from './Game/Registrations';
import { GameMutations } from '../graphql/mutations';
import { Button } from '../components/Button';
import { useRequiredContext } from '../hooks/useRequiredContext';
import {
    AuthenticationContext,
    IUser,
} from '../contexts/AuthenticationWrapper';

interface ITiles {
    wood: Number;
    stone: Number;
    livestock: Number;
    wheat: Number;
    iron: Number;
}

interface IShoppingCart {
    soldier: Number;
    horseman: Number;
    cannon: Number;
    ship: Number;
    settler: Number;
    city: Number;
    road: Number;
    wall: Number;
}

interface IRegistration {
    _id: string;
    player: {
        _id: string;
        name: string;
    };
    tiles: ITiles;
    stockpile: ITiles;
    shoppingCart: IShoppingCart;
}

interface IGame {
    _id: string;
    owner: IUser;
    registrations: IRegistration[];
}

export const GameContext = createContext<{ game: IGame } | undefined>(
    undefined
);

export const Game = ({ match }: RouteComponentProps<{ gameCode: string }>) => {
    const { user } = useRequiredContext(AuthenticationContext);
    const [game, setGame] = useState<IGame | undefined>();

    const updateGame = (data: any) => {
        if ('game' in data) {
            setGame(data.game);
        }
        if ('subscriptionData' in data) {
            console.log(data.subscriptionData.data.gameUpdated);
            setGame(data.subscriptionData.data.gameUpdated);
        }
    };

    const [register] = useMutation(GameMutations.REGISTER, {
        variables: { code: match.params.gameCode },
    });

    useQuery(FIND_GAME, {
        variables: { code: match.params.gameCode },
        onCompleted: updateGame,
    });

    useSubscription(GAME_UPDATED, {
        variables: { code: match.params.gameCode },
        onSubscriptionData: updateGame,
    });

    if (!game) return <div>loading</div>;

    console.log(game.registrations);

    const canRegister =
        game.registrations.length < 6 &&
        !game.registrations.some(({ player }) => player._id === user._id);

    console.log(game);

    const isOwner = game.owner._id === user._id;

    const canStart = isOwner && game.registrations.length > 1;

    return (
        <GameContext.Provider value={{ game }}>
            {match.params.gameCode}
            <Registrations />
            {canRegister && (
                <Button onClick={() => register()}>Join game</Button>
            )}{' '}
            {canStart && <Button onClick={() => register()}>Start game</Button>}
        </GameContext.Provider>
    );
};
