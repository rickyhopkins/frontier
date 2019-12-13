import * as React from "react";
import { Units } from "../../@types/frontier";
import { styled } from "linaria/react";
import { useRequiredContext } from "../../hooks/useRequiredContext";
import { GameContext } from "../Game";
import { AuthenticationContext } from "../../contexts/AuthenticationWrapper";
import soldier from "../../assets/images/soldier.png";
import horseman from "../../assets/images/horseman.png";
import cannon from "../../assets/images/cannon.png";
import ship from "../../assets/images/ship.png";
import settler from "../../assets/images/settler.png";
import city from "../../assets/images/city.png";
import road from "../../assets/images/road.png";
import wall from "../../assets/images/wall.png";
import { useMutation } from "@apollo/react-hooks";
import { GameMutations } from "../../graphql/mutations";

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

export const UnitTile = ({ unit }: IProps) => {
    const { game } = useRequiredContext(GameContext);
    const { user } = useRequiredContext(AuthenticationContext);
    const [buyUnit] = useMutation(GameMutations.BUY_UNIT);
    const [sellUnit] = useMutation(GameMutations.SELL_UNIT);

    const unitSrc = (() => {
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
    })();

    const registration = game.registrations.find(
        ({ player }) => player._id === user._id
    );

    if (!registration) return null;

    const onBuyClick = async () => {
        try {
            const res = await buyUnit({
                variables: {
                    registrationId: registration._id,
                    code: game.code,
                    unit,
                },
            });
            console.log(res);
        } catch (err) {
            console.log(err.message);
        }
    };

    const onSellClick = () => {
        sellUnit({
            variables: {
                registrationId: registration._id,
                code: game.code,
                unit,
            },
        });
    };

    return (
        <UnitWrapper>
            <UnitImg src={unitSrc} alt={unit} />
            <div onClick={onSellClick}>-</div>
            <div>{registration.shoppingCart[unit]}</div>
            <div onClick={onBuyClick}>+</div>
        </UnitWrapper>
    );
};
