import * as React from "react";
import { motion } from "framer-motion";
import { styled } from "linaria/react";
import { Theme } from "../../styles/Theme";
import { useContext } from "react";
import { NotificationsContext } from "./Notifications";

interface IProps {
    toggle: () => void;
}

const NotificationButton = styled(motion.button)`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    outline: none;
    border: none;
    user-select: none;
    right: 1rem;
    top: 0;
    width: 4rem;
    height: 4rem;
    background-color: ${Theme.colors.primary.color};
    color: #fff;
    border-radius: 50%;
`;

const variants = {
    hidden: {
        y: "0rem",
    },
    open: { y: "-5rem" },
    closed: { y: "-5rem" },
};

export const NotificationsToggle = ({ toggle }: IProps) => {
    const { notifications } = useContext(NotificationsContext);

    return (
        <NotificationButton
            variants={variants}
            onClick={toggle}
            whileTap={{ scale: 1.1 }}
        >
            {notifications.length}
        </NotificationButton>
    );
};
