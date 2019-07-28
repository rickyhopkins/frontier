import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

export const Game = ({ match }: RouteComponentProps<{ gameCode: string }>) => {
    return <div>{match.params.gameCode}</div>;
};
