import * as React from "react";
import { styled } from "linaria/react";
import { Theme } from "../../styles/Theme";
import { GameContext, ITrade } from "../../pages/Game";
import { useRequiredContext } from "../../hooks/useRequiredContext";
import { Resources } from "../../@types/frontier";
import { SmallButton } from "../Button";
import { useMutation } from "@apollo/react-hooks";
import { GameMutations } from "../../graphql/mutations";

const Item = styled.li`
    padding: 1rem;
    list-style: none;
    margin: 0 0 20px;
    color: ${Theme.colors.primary.background};
    background-color: #fff;
    border-radius: 4px;
    display: grid;
    grid-template-columns: 2rem 1fr 1fr 2rem;
    grid-gap: 1rem;
    align-items: center;
    text-align: center;
`;

const ItemTitle = styled.span`
    grid-column-start: 1;
    grid-column-end: -1;
    text-align: center;
`;

interface IProps {
    trade: ITrade;
}

export const NotificationItem = ({ trade }: IProps) => {
    const { game } = useRequiredContext(GameContext);
    const [acceptTrade] = useMutation(GameMutations.ACCEPT_TRADE);

    const onmAcceptClick = () => {
        acceptTrade({
            variables: {
                code: game.code,
                tradeId: trade._id,
            },
        });
    };

    const fromRegistration = game.registrations.find(
        ({ _id }) => trade.fromRegistration === _id
    );

    if (!fromRegistration) return null;

    const toMe: Resources[] = Object.values(Resources).filter(
        (resource: Resources) => trade.tradeValues[resource] < 0
    );
    const fromMe: Resources[] = Object.values(Resources).filter(
        (resource: Resources) => trade.tradeValues[resource] > 0
    );

    const mapResource = (resource: Resources) => {
        return (
            <div>
                {Math.abs(trade.tradeValues[resource])} {resource}
            </div>
        );
    };

    return (
        <Item>
            <ItemTitle>Trade from {fromRegistration.player.name}</ItemTitle>
            <SmallButton>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                >
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    <path d="M0 0h24v24H0z" fill="none" />
                </svg>
            </SmallButton>
            <div>
                <p>{fromRegistration.player.name} gets</p>
                {fromMe.map(mapResource)}
            </div>
            <div>
                <p>You get</p>
                {toMe.map(mapResource)}
            </div>
            <SmallButton onClick={onmAcceptClick}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
            </SmallButton>
        </Item>
    );
};
