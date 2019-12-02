import * as React from "react";
import { createContext } from "react";
import { motion, useCycle } from "framer-motion";
import { styled } from "linaria/react";
import { NotificationsToggle } from "./NotificationsToggle";
import { NotificationItems } from "./NotificationItems";
import { GameContext, ITrade } from "../../pages/Game";
import { useRequiredContext } from "../../hooks/useRequiredContext";
import { AuthenticationContext } from "../../contexts/AuthenticationWrapper";
import { Theme } from "../../styles/Theme";

const NavWrapper = styled(motion.nav)`
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    background-color: ${Theme.colors.secondary.background};
    color: #fff;
`;

const variants = {
    hidden: {
        top: "100%",
    },
    open: {
        top: "6rem",
    },
    closed: {
        top: "100%",
    },
};

export const NotificationsContext = createContext<{
    notifications: ITrade[];
}>({
    notifications: [],
});

export const Notifications = () => {
    const [isOpen, toggleOpen] = useCycle(false, true);
    const {
        game: { registrations, trades },
    } = useRequiredContext(GameContext);
    const { user } = useRequiredContext(AuthenticationContext);

    const myRegistration = registrations.find(
        ({ player: { _id } }) => user._id === _id
    );

    const filteredTrades = trades.filter(
        ({ toRegistration, outcome }) =>
            myRegistration &&
            toRegistration === myRegistration._id &&
            outcome === "pending"
    );

    const currentVariant =
        filteredTrades.length === 0 ? "hidden" : isOpen ? "open" : "closed";

    return (
        <NotificationsContext.Provider
            value={{ notifications: filteredTrades }}
        >
            <NavWrapper
                initial={false}
                animate={currentVariant}
                variants={variants}
            >
                <NotificationsToggle toggle={() => toggleOpen()} />
                <NotificationItems />
            </NavWrapper>
        </NotificationsContext.Provider>
    );
};
