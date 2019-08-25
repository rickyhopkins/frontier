import * as React from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { styled } from "linaria/react";
import iron from "../../assets/images/iron.png";
import livestock from "../../assets/images/livestock.png";
import stone from "../../assets/images/stone.png";
import wheat from "../../assets/images/wheat.png";
import wood from "../../assets/images/wood.png";
import { Resources } from "../../../@types/frontier";
import { Theme } from "../../styles/Theme";
import { useMutation } from "@apollo/react-hooks";
import { GameMutations } from "../../graphql/mutations";
import { IRegistration } from "../Game";
import { useTimeout } from "../../hooks/useTimeout";

const StyledTile = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 4px;
    height: 100%;
    padding: 0 0.75rem;
    background-color: ${Theme.colors.contrast.background};
    color: #d3d3d3;

    img {
        height: 100%;
    }
`;

interface IProps {
    resourceType: Resources;
    registration: IRegistration;
    gameCode: string;
}

export const ResourceTile = ({
    resourceType,
    gameCode,
    registration,
}: IProps) => {
    const getTileCount = () => registration.tiles[resourceType] || 0;
    const tileCount = useRef(getTileCount());
    const [localCount, setLocalCount] = useState(0);
    const [addResourceMutation] = useMutation(GameMutations.ADD_RESOURCE);
    const { start, stop, isActive } = useTimeout(() => {
        setLocalCount(0);
        tileCount.current = getTileCount();
    }, 1000);

    useLayoutEffect(() => {
        if (getTileCount() !== tileCount.current) {
            start();
        }
    }, [registration]);

    const addResource = (value = 1) => {
        if (isActive) {
            stop();
        }
        setLocalCount(oldCount => oldCount + value);
        addResourceMutation({
            variables: {
                code: gameCode,
                registrationId: registration._id,
                resource: resourceType,
                value,
            },
        });
    };

    const iconSrc = (() => {
        switch (resourceType) {
            case "iron":
                return iron;
            case "livestock":
                return livestock;
            case "stone":
                return stone;
            case "wheat":
                return wheat;
            case "wood":
            default:
                return wood;
        }
    })();

    return (
        <StyledTile>
            <img src={iconSrc} alt={resourceType} />
            <div onClick={() => addResource(-1)}>-</div>
            <div>{tileCount.current + localCount}</div>
            <div onClick={() => addResource()}>+</div>
        </StyledTile>
    );
};
