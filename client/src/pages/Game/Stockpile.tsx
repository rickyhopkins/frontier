import * as React from "react";
import { ITiles } from "../Game";
import { Resources } from "../../@types/frontier";
import { StockpileTile } from "./StockpileTile";

interface IProps {
    stockpile: ITiles;
    isCurrentUser?: boolean;
    isMerchant?: boolean;
}

export const Stockpile = ({ stockpile, isCurrentUser, isMerchant }: IProps) => {
    return (
        <>
            {Object.values(Resources).map((resource: Resources) => (
                <StockpileTile
                    key={resource}
                    resource={resource}
                    value={stockpile[resource]}
                    isCurrentUser={isCurrentUser}
                    isMerchant={isMerchant}
                />
            ))}
        </>
    );
};
