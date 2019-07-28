import { AppWrapper } from '../App.styles';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import React from 'react';
import { useMutation } from 'react-apollo-hooks';
import { Redirect } from 'react-router-dom';
import gql from 'graphql-tag';

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
            <AppWrapper>
                <p>Search for a game</p>
                <Input />
            </AppWrapper>
            <h5>OR</h5>
            <Button onClick={() => createGame()} disabled={loading}>
                Start a new game
            </Button>
        </>
    );
};
