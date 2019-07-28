import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Game } from './pages/Game';

export const Router = () => {
    return (
        <BrowserRouter>
            <Route path="/" exact component={Home} />
            <Route path="/:gameCode" exact component={Game} />
        </BrowserRouter>
    );
};
