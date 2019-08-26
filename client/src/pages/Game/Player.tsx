import * as React from "react";
import { styled } from "linaria/react";
import { Theme } from "../../styles/Theme";
import { ResourceTile } from "./ResourceTile";
import { useRequiredContext } from "../../hooks/useRequiredContext";
import { GameContext, IRegistration } from "../Game";
import { AnimatePresence, motion } from "framer-motion";
import { Resources } from "../../@types/frontier";

interface IProps {
    registration: IRegistration;
    state: string;
}

const PlayerWrapper = styled(motion.div)`
    background-color: ${Theme.colors.contrast.background};
    border-radius: 4px;
    margin: 0.5rem;
`;

const TileWrapper = styled(motion.div)`
    color: #fff;
`;

export const Player = ({ registration, state }: IProps) => {
    const { game } = useRequiredContext(GameContext);
    const { player } = registration;

    return (
        <PlayerWrapper
            animate={{
                backgroundColor:
                    game.stage === "open"
                        ? Theme.colors.contrast.background
                        : "transparent",
            }}
        >
            <div style={{ padding: "1rem" }}>{player.name}</div>
            <AnimatePresence>
                {game.stage !== "open" &&
                    Object.values(Resources).map(resource => (
                        <TileWrapper
                            initial={{
                                height: 0,
                                opacity: 0,
                                marginBottom: "0rem",
                                color: "transparent",
                            }}
                            animate={{
                                height: "3rem",
                                opacity: 1,
                                marginBottom: "1rem",
                                color: "currentColor",
                            }}
                            exit={{
                                height: 0,
                                opacity: 0,
                                marginBottom: "0rem",
                                color: "transparent",
                            }}
                            key={resource}
                        >
                            <ResourceTile
                                registration={registration}
                                resourceType={resource}
                            />
                        </TileWrapper>
                    ))}
            </AnimatePresence>
        </PlayerWrapper>
    );
};
