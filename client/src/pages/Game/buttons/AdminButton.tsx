import * as React from "react";
import { useRequiredContext } from "../../../hooks/useRequiredContext";
import { AuthenticationContext } from "../../../contexts/AuthenticationWrapper";
import { GameContext, IGame, IRegistration } from "../../Game";
import { Button } from "../../../components/Button";
import { useMutation } from "@apollo/react-hooks";
import { GameMutations } from "../../../graphql/mutations";
import { pluralize } from "../../../utils/pluralize";
import { Resources } from "../../../@types/frontier";

const getButtonText = (game: IGame): { text: string; disabled?: boolean } => {
    switch (game.stage) {
        case "turns":
            const pendingPlayerCount = game.registrations.reduce<number>(
                (count, registration) =>
                    registration.active ? count + 1 : count,
                0
            );
            return pendingPlayerCount === 0
                ? { text: "End round" }
                : {
                      text: `Waiting for ${pluralize(
                          pendingPlayerCount,
                          "player"
                      )}`,
                      disabled: true,
                  };
        case "tiles":
            return { text: "Start round" };
        case "open":
        default:
            return game.registrations.length > 1
                ? { text: "Start game" }
                : { text: "Waiting for at least 2 players", disabled: true };
    }
};

const getNextStage = (stage: IGame["stage"]) => {
    switch (stage) {
        case "tiles":
            return "turns";
        case "open":
        case "turns":
        default:
            return "tiles";
    }
};

const resetCart = ({
    shoppingCart,
    ...registration
}: IRegistration): IRegistration => {
    return {
        ...registration,
        shoppingCart: Object.keys(shoppingCart).reduce(
            (cart, key) => ({ ...cart, [key]: 0 }),
            shoppingCart
        ),
    };
};

const addResources = ({
    stockpile,
    ...registration
}: IRegistration): IRegistration => {
    return {
        ...registration,
        stockpile: Object.keys(stockpile).reduce(
            (stock, resource) => ({
                ...stock,
                [resource]:
                    stock[resource as Resources] +
                    registration.tiles[resource as Resources],
            }),
            stockpile
        ),
    };
};

const progressRegistration = (
    registration: IRegistration,
    currentStage: IGame["stage"]
) => {
    return currentStage === "tiles"
        ? { ...addResources(resetCart(registration)), active: true }
        : registration;
};

export const AdminButton = () => {
    const { game, registration } = useRequiredContext(GameContext);
    const { user } = useRequiredContext(AuthenticationContext);

    const [nextStage] = useMutation(GameMutations.NEXT_STAGE, {
        variables: { code: game.code },
        optimisticResponse: {
            __typename: "Mutation",
            nextStage: {
                ...game,
                stage: getNextStage(game.stage),
                registrations: game.registrations.map(registration =>
                    progressRegistration(registration, game.stage)
                ),
            },
        },
    });

    if (
        game.owner._id !== user._id ||
        (game.stage !== "open" && registration && registration.active)
    ) {
        return null;
    }

    const { text, disabled } = getButtonText(game);

    return (
        <Button onClick={() => nextStage()} disabled={disabled}>
            {text}
        </Button>
    );
};
