import { Button } from '../components/Button';
import React from 'react';
import { Redirect } from 'react-router-dom';
import gql from 'graphql-tag';
import { GameSearch } from './Home/GameSearch';
import { useMutation } from '@apollo/react-hooks';

const CREATE_GAME = gql`
    mutation createGame {
        createGame {
            _id
            code
        }
    }
`;

export const Home = () => {
    const [createGame, { data, loading }] = useMutation<{
        createGame: { code: string };
    }>(CREATE_GAME);

    if (data) {
        return <Redirect push to={`/${data.createGame.code}`} />;
    }

    return (
        <>
            <GameSearch />
            <h5>OR</h5>
            <Button onClick={() => createGame()} disabled={loading}>
                Start a new game
            </Button>
        </>
    );
};
