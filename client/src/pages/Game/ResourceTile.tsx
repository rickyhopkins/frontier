import * as React from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { styled } from "linaria/react";
import iron from "../../assets/images/iron.png";
import livestock from "../../assets/images/livestock.png";
import stone from "../../assets/images/stone.png";
import wheat from "../../assets/images/wheat.png";
import wood from "../../assets/images/wood.png";
import { Theme } from "../../styles/Theme";
import { useMutation } from "@apollo/react-hooks";
import { GameMutations } from "../../graphql/mutations";
import { GameContext, IRegistration } from "../Game";
import { useTimeout } from "../../hooks/useTimeout";
import { useRequiredContext } from "../../hooks/useRequiredContext";
import { Resources } from "../../@types/frontier";

const StyledTile = styled.div`
    display: grid;
    grid-template-columns: 3rem 1fr 2rem 1fr;
    gap: 0.5rem;
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
}

export const ResourceTile = ({ resourceType, registration }: IProps) => {
    const {
        game: { code, stage },
    } = useRequiredContext(GameContext);
    const getTileCount = () =>
        registration[stage === "turns" ? "stockpile" : "tiles"][
            resourceType as Resources
        ] || 0;
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
        if (getTileCount() + value < 0) return;
        if (isActive) {
            stop();
        }
        setLocalCount(oldCount => oldCount + value);
        addResourceMutation({
            variables: {
                code,
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
            <div style={{ textAlign: "center" }}>
                {tileCount.current + localCount}
            </div>
            <div onClick={() => addResource()}>+</div>
        </StyledTile>
    );
};
