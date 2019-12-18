import * as React from "react";
import { useRequiredContext } from "../../hooks/useRequiredContext";
import { GameContext } from "../Game";
import { Button } from "../../components/Button";
import { useMutation } from "@apollo/react-hooks";
import { GameMutations } from "../../graphql/mutations";

export const TurnButton = () => {
    const {
        registration,
        game: { stage, _id },
    } = useRequiredContext(GameContext);

    const [endTurn] = useMutation(GameMutations.END_TURN, {
        variables: { gameId: _id },
        optimisticResponse: {
            __typename: "Mutation",
            endTurn: {
                ...registration,
                active: false,
            },
        },
    });

    console.log(registration);

    if (!registration || !registration.active || stage !== "turns") return null;

    return <Button onClick={() => endTurn()}>End turn</Button>;
};
