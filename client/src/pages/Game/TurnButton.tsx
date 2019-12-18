import * as React from "react";
import { useRequiredContext } from "../../hooks/useRequiredContext";
import { GameContext } from "../Game";
import { Button } from "../../components/Button";
import { useMutation } from "@apollo/react-hooks";
import { GameMutations } from "../../graphql/mutations";

export const TurnButton = () => {
    const {
        registration,
        game: { stage },
    } = useRequiredContext(GameContext);

    const [endTurn] = useMutation(GameMutations.END_TURN, {
        optimisticResponse: {
            __typename: "Mutation",
            endTurn: {
                ...registration,
                active: false,
            },
        },
    });

    if (!registration || !registration.active || stage !== "turns") return null;

    return <Button onClick={() => endTurn()}>End turn</Button>;
};
