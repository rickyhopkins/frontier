import * as React from "react";
import { useContext } from "react";
import { NotificationItem } from "./NotificationItem";
import { styled } from "linaria/react";
import { NotificationsContext } from "./Notifications";

const NotificationContainer = styled.ul`
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: auto;
    margin: 0;
    padding: 1rem;
`;

export const NotificationItems = () => {
    const { notifications } = useContext(NotificationsContext);

    return (
        <NotificationContainer>
            {notifications.map((trade, i) => (
                <NotificationItem key={i} trade={trade} />
            ))}
        </NotificationContainer>
    );
};
