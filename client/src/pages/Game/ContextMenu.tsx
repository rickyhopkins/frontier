import * as React from "react";
import { useRequiredContext } from "../../hooks/useRequiredContext";
import { GameContext } from "../Game";
import { styled } from "linaria/react";
import { AuthenticationContext } from "../../contexts/AuthenticationWrapper";

export const ContextMenuWrapper = styled.div`
    text-align: center;
`;

export const ContextMenu = () => {
    const { game } = useRequiredContext(GameContext);
    const { user } = useRequiredContext(AuthenticationContext);

    const content = (() => {
        switch (game.stage) {
            case "open":
                return (
                    <>
                        Game code: <div>{game.code}</div>
                    </>
                );
            case "tiles":
                return "Resources per turn";
            case "turns":
                return user.name;
        }
    })();

    return <ContextMenuWrapper>{content}</ContextMenuWrapper>;
};
