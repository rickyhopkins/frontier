import * as React from 'react';
import { ChangeEventHandler, FormEventHandler, useState } from 'react';
import { Input } from '../components/Input';
import { CREATE_PLAYER } from '../graphql/create-player';
import { LoginForm } from './Login.styles';
import { Button } from '../components/Button';
import { useMutation } from '@apollo/react-hooks';

interface IProps {
    setToken: (token: string) => void;
}

export const Login = ({ setToken }: IProps) => {
    const [name, setName] = useState('');

    const [createPlayer] = useMutation<
        { createPlayer: string },
        { name: string }
    >(CREATE_PLAYER, {
        variables: { name },
    });

    const onSubmit: FormEventHandler = async e => {
        e.preventDefault();
        const res = await createPlayer();
        if (res && res.data) {
            setToken(res.data.createPlayer);
        }
    };

    const onChange: ChangeEventHandler<HTMLInputElement> = e => {
        setName(e.target.value);
    };

    return (
        <LoginForm onSubmit={onSubmit}>
            <h3>Who's playing this game?</h3>
            <Input value={name} onChange={onChange} placeholder={'Name'} />
            <Button>Let's begin</Button>
        </LoginForm>
    );
};
