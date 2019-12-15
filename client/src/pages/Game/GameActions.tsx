import * as React from "react";
import { Button } from "../../components/Button";
import { useRequiredContext } from "../../hooks/useRequiredContext";
import { GameContext } from "../Game";
import { AuthenticationContext } from "../../contexts/AuthenticationWrapper";
import { useMutation } from "@apollo/react-hooks";
import { GameMutations } from "../../graphql/mutations";
import { styled } from "linaria/react";
import { Theme } from "../../styles/Theme";
import { TurnButton } from "./TurnButton";

const GameActionsWrapper = styled.div`
    position: sticky;
    bottom: 0;
    width: 100vw;
    display: flex;
    justify-content: center;
    padding: 1rem;
    background-color: ${Theme.colors.primary.background};
    border: 1px solid #202b2b;
`;

export const GameActions = () => {
    const { game } = useRequiredContext(GameContext);
    const { user } = useRequiredContext(AuthenticationContext);

    const [register] = useMutation(GameMutations.REGISTER, {
        variables: { code: game.code },
    });
    const [nextStage] = useMutation(GameMutations.NEXT_STAGE, {
        variables: { code: game.code },
    });

    const canRegister =
        game.registrations.length < 6 &&
        !game.registrations.some(({ player }) => player._id === user._id);

    const isOwner = game.owner._id === user._id;

    const canStart = game.registrations.length > 1;

    return (
        <GameActionsWrapper>
            {canRegister && (
                <Button onClick={() => register()}>Join game</Button>
            )}
            <TurnButton />
            {isOwner && (
                <Button onClick={() => nextStage()} disabled={!canStart}>
                    {canStart ? "Start game" : "Waiting for one more player"}
                </Button>
            )}
        </GameActionsWrapper>
    );
};
