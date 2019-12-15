import * as React from "react";
import { Resources, Units } from "../../@types/frontier";
import { styled } from "linaria/react";
import { useRequiredContext } from "../../hooks/useRequiredContext";
import { GameContext, IRegistration, ITiles } from "../Game";
import { AuthenticationContext } from "../../contexts/AuthenticationWrapper";
import soldier from "../../assets/images/soldier.png";
import horseman from "../../assets/images/horseman.png";
import cannon from "../../assets/images/cannon.png";
import ship from "../../assets/images/ship.png";
import settler from "../../assets/images/settler.png";
import city from "../../assets/images/city.png";
import road from "../../assets/images/road.png";
import wall from "../../assets/images/wall.png";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { GameMutations } from "../../graphql/mutations";
import { TertiaryButton } from "../../components/Button";
import { FIND_REGISTRATION } from "../../graphql/find-registration";

interface IProps {
    unit: Units;
}

const UnitWrapper = styled.div`
    background-color: #1a2b33;
    border-radius: 4px;
    display: grid;
    grid-template-columns: 3fr 1fr 1fr 1fr;
    align-items: center;
    justify-items: center;
    color: #fff;
`;

const UnitImg = styled.img`
    height: 3rem;
`;

const getSrc = (unit: Units) => {
    switch (unit) {
        case "soldier":
            return soldier;
        case "horseman":
            return horseman;
        case "cannon":
            return cannon;
        case "ship":
            return ship;
        case "settler":
            return settler;
        case "city":
            return city;
        case "road":
            return road;
        case "wall":
        default:
            return wall;
    }
};

export const UnitConsts: Record<Units, Partial<ITiles>> = {
    soldier: { wood: 1, livestock: 1, wheat: 2, iron: 1 },
    horseman: { wood: 1, livestock: 2, wheat: 3, iron: 1 },
    cannon: { wood: 3, iron: 5 },
    ship: { wood: 4, stone: 1, livestock: 1, wheat: 1, iron: 5 },
    settler: { wood: 2, stone: 2, livestock: 3, wheat: 2 },
    city: { wood: 4, stone: 4, livestock: 3, wheat: 4, iron: 2 },
    road: { stone: 3 },
    wall: { stone: 4 },
};

const modifyRegistration = (
    registration: IRegistration,
    unit: Units,
    sell?: boolean
) => {
    const costs = UnitConsts[unit];

    return {
        ...registration,
        shoppingCart: {
            ...registration.shoppingCart,
            [unit]: registration.shoppingCart[unit] + (sell ? -1 : 1),
        },
        stockpile: {
            ...Object.entries(costs).reduce((stockpile, [resource, value]) => {
                if (!value) return stockpile;
                return {
                    ...stockpile,
                    [resource]:
                        stockpile[resource as Resources] +
                        (sell ? value : -value),
                };
            }, registration.stockpile),
        },
    };
};

export const UnitTile = ({ unit }: IProps) => {
    const { game } = useRequiredContext(GameContext);
    const { user } = useRequiredContext(AuthenticationContext);
    const [buyUnit] = useMutation(GameMutations.BUY_UNIT);
    const [sellUnit] = useMutation(GameMutations.SELL_UNIT);

    const r = game.registrations.find(({ player }) => player._id === user._id);

    const { data } = useQuery<{ registration: IRegistration }>(
        FIND_REGISTRATION,
        {
            variables: { id: (r as any)._id },
        }
    );
    if (!data) return null;
    const { registration } = data;

    const unitSrc = getSrc(unit);

    if (!registration) return null;

    const onBuyClick = async () => {
        try {
            buyUnit({
                variables: {
                    registrationId: registration._id,
                    unit,
                },
                optimisticResponse: {
                    __typename: "Mutation",
                    buyUnit: modifyRegistration(registration, unit),
                },
            });
        } catch (err) {
            console.log(err.message);
        }
    };

    const onSellClick = () => {
        sellUnit({
            variables: {
                registrationId: registration._id,
                unit,
            },
            optimisticResponse: {
                __typename: "Mutation",
                sellUnit: modifyRegistration(registration, unit, true),
            },
        });
    };

    const costs = UnitConsts[unit];

    const enoughResources = Object.entries(costs).every(
        ([resource, value]) =>
            value && registration.stockpile[resource as Resources] >= value
    );

    return (
        <UnitWrapper>
            <UnitImg src={unitSrc} alt={unit} />
            <TertiaryButton
                onClick={onSellClick}
                disabled={registration.shoppingCart[unit] < 1}
            >
                -
            </TertiaryButton>
            <div>{registration.shoppingCart[unit]}</div>
            <TertiaryButton onClick={onBuyClick} disabled={!enoughResources}>
                +
            </TertiaryButton>
        </UnitWrapper>
    );
};
