import * as React from 'react';
import { ChangeEventHandler, FormEventHandler, useState } from 'react';
import { Input } from '../components/Input';
import { useMutation } from 'react-apollo-hooks';
import { CREATE_PLAYER } from '../graphql/create-player';

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
        setToken(res.data.createPlayer);
    };

    const onChange: ChangeEventHandler<HTMLInputElement> = e => {
        setName(e.target.value);
    };

    return (
        <form onSubmit={onSubmit}>
            <Input value={name} onChange={onChange} />
            <div>Login</div>
        </form>
    );
};
