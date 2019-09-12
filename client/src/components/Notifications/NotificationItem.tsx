import * as React from "react";
import { motion } from "framer-motion";
import { styled } from "linaria/react";
import { Theme } from "../../styles/Theme";
import { GameContext, ITrade } from "../../pages/Game";
import { useRequiredContext } from "../../hooks/useRequiredContext";
import { Resources } from "../../@types/frontier";

const Item = styled(motion.li)`
    padding: 1rem;
    list-style: none;
    margin: 0 0 20px;
    color: ${Theme.colors.primary.background};
    background-color: #fff;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
`;

interface IProps {
    trade: ITrade;
}

export const NotificationItem = ({ trade }: IProps) => {
    const { game } = useRequiredContext(GameContext);

    const fromRegistration = game.registrations.find(
        ({ _id }) => trade.fromRegistration === _id
    );

    if (!fromRegistration) return null;

    const toMe: Resources[] = Object.values(Resources).filter(
        (resource: Resources) => trade.tradeValues[resource] > 0
    );
    const fromMe: Resources[] = Object.values(Resources).filter(
        (resource: Resources) => trade.tradeValues[resource] < 0
    );

    return (
        <Item whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <span>Trade from {fromRegistration.player.name}</span>
            <span>
                {fromMe.map(
                    resource => `${trade.tradeValues[resource]} ${resource}`
                )}
            </span>
            <span>
                {toMe.map(
                    resource => `${trade.tradeValues[resource]} ${resource}`
                )}
            </span>
        </Item>
    );
};
