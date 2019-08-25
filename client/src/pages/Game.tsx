import * as React from "react";
import { createContext, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useQuery, useSubscription } from "@apollo/react-hooks";
import { GAME_UPDATED } from "../graphql/game-updated";
import { FIND_GAME } from "../graphql/find-game";
import { IUser } from "../contexts/AuthenticationWrapper";
import { Registrations } from "./Game/Registrations";
import { ContextMenu } from "./Game/ContextMenu";
import { GameActions } from "./Game/GameActions";
import { styled } from "linaria/react";

interface ITiles {
    wood: number;
    stone: number;
    livestock: number;
    wheat: number;
    iron: number;
}

interface IShoppingCart {
    soldier: number;
    horseman: number;
    cannon: number;
    ship: number;
    settler: number;
    city: number;
    road: number;
    wall: number;
}

export interface IRegistration {
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
    code: string;
    registrations: IRegistration[];
    status: "open" | "tiles";
}

const GameLayout = styled.div`
    display: grid;
    grid-template-rows: 5rem 1fr;
`;

export const GameContext = createContext<{ game: IGame } | undefined>(
    undefined
);

export const Game = ({ match }: RouteComponentProps<{ gameCode: string }>) => {
    const [game, setGame] = useState<IGame | undefined>();

    const updateGame = (data: any) => {
        if ("game" in data) {
            setGame(data.game);
        }
        if ("subscriptionData" in data) {
            console.log(data.subscriptionData.data.gameUpdated);
            setGame(data.subscriptionData.data.gameUpdated);
        }
    };

    useQuery(FIND_GAME, {
        variables: { code: match.params.gameCode },
        onCompleted: updateGame,
    });

    useSubscription(GAME_UPDATED, {
        variables: { code: match.params.gameCode },
        onSubscriptionData: updateGame,
    });

    if (!game) return <div>loading</div>;

    return (
        <GameContext.Provider value={{ game }}>
            <GameLayout>
                <ContextMenu />
                <Registrations />
                <GameActions />
            </GameLayout>
        </GameContext.Provider>
    );
};
