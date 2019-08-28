import * as React from "react";
import { styled } from "linaria/react";
import { ITiles } from "../Game";
import { Resources } from "../../@types/frontier";
import { StockpileTile } from "./StockpileTile";

const StockpileWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 1rem;
`;

interface IProps {
    stockpile: ITiles;
    isCurrentUser?: boolean;
    isMerchant?: boolean;
}

export const Stockpile = ({ stockpile, isCurrentUser, isMerchant }: IProps) => {
    return (
        <StockpileWrapper>
            {Object.values(Resources).map((resource: Resources) => (
                <StockpileTile
                    key={resource}
                    resource={resource}
                    value={stockpile[resource]}
                    isCurrentUser={isCurrentUser}
                    isMerchant={isMerchant}
                />
            ))}
        </StockpileWrapper>
    );
};
