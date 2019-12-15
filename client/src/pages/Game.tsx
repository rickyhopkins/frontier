import * as React from "react";
import { createContext } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useQuery, useSubscription } from "@apollo/react-hooks";
import { GAME_UPDATED } from "../graphql/game-updated";
import { FIND_GAME } from "../graphql/find-game";
import {
    AuthenticationContext,
    IUser,
} from "../contexts/AuthenticationWrapper";
import { Registrations } from "./Game/Registrations";
import { ContextMenu } from "./Game/ContextMenu";
import { GameActions } from "./Game/GameActions";
import { styled } from "linaria/react";
import { Purchasing } from "./Game/Purchasing";
import { Resources, Units } from "../@types/frontier";
import { Notifications } from "../components/Notifications/Notifications";
import { useRequiredContext } from "../hooks/useRequiredContext";

export type ITiles = Record<Resources, number>;

export type IShoppingCart = Record<Units, number>;

export interface IRegistration {
    _id: string;
    player: {
        _id: string;
        name: string;
    };
    tiles: ITiles;
    stockpile: ITiles;
    shoppingCart: IShoppingCart;
    active: boolean;
}

export interface ITrade {
    _id: string;
    fromRegistration: string;
    toRegistration: string;
    outcome: string;
    tradeValues: ITiles;
}

interface IGame {
    _id: string;
    owner: IUser;
    code: string;
    registrations: IRegistration[];
    trades: ITrade[];
    stage: "open" | "tiles" | "turns";
}

const GameLayout = styled.div`
    display: grid;
    grid-template-rows: 3rem 1fr;
    justify-items: center;
`;

const GameContent = styled.div`
    border: 1px solid #202b2b;
    padding: 1rem;
    margin-bottom: 2rem;
`;

export const GameContext = createContext<
    { game: IGame; registration?: IRegistration } | undefined
>(undefined);

export const Game = ({ match }: RouteComponentProps<{ gameCode: string }>) => {
    const { user } = useRequiredContext(AuthenticationContext);
    const { data, loading } = useQuery<{ game: IGame }>(FIND_GAME, {
        variables: { code: match.params.gameCode },
    });

    useSubscription(GAME_UPDATED, {
        variables: { code: match.params.gameCode },
    });

    if (loading || !data) return <div>loading</div>;

    const { game } = data;

    const registration = game.registrations.find(
        ({ player }) => player._id === user._id
    );

    return (
        <GameContext.Provider value={{ game, registration }}>
            <GameLayout>
                <ContextMenu />
                <GameContent>
                    <Purchasing />
                    <Registrations />
                </GameContent>
                <GameActions />
            </GameLayout>
            <Notifications />
        </GameContext.Provider>
    );
};
