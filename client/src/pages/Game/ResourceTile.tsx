import * as React from "react";
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
import { useRequiredContext } from "../../hooks/useRequiredContext";
import { Resources } from "../../@types/frontier";
import { TertiaryButton } from "../../components/Button";
import { AuthenticationContext } from "../../contexts/AuthenticationWrapper";

const StyledTile = styled.div`
    display: grid;
    grid-template-columns: 3rem 1fr 2rem 1fr;
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
        game: { owner },
    } = useRequiredContext(GameContext);
    const { user } = useRequiredContext(AuthenticationContext);
    const [addResourceMutation] = useMutation(GameMutations.ADD_RESOURCE);

    const tileCount = registration.tiles[resourceType];
    const isOwner = user._id === owner._id;

    const addResource = (value = 1) => {
        addResourceMutation({
            variables: {
                registrationId: registration._id,
                resource: resourceType,
                value,
            },
            optimisticResponse: {
                __typename: "Mutation",
                addResource: {
                    ...registration,
                    tiles: {
                        ...registration.tiles,
                        [resourceType]:
                            registration.tiles[resourceType] + value,
                    },
                },
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
            <TertiaryButton
                onClick={() => addResource(-1)}
                disabled={!isOwner || tileCount < 1}
            >
                -
            </TertiaryButton>
            <div style={{ textAlign: "center" }}>{tileCount}</div>
            <TertiaryButton onClick={() => addResource()} disabled={!isOwner}>
                +
            </TertiaryButton>
        </StyledTile>
    );
};
