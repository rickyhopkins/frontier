import * as React from "react";
import { ITiles } from "../Game";
import { Resources } from "../../@types/frontier";
import { StockpileTile } from "./StockpileTile";

interface IProps {
    stockpile: ITiles;
    isCurrentUser?: boolean;
    isMerchant?: boolean;
}

interface IMerchantProps {
    isMerchant: true;
}

export const Stockpile = (props: IProps | IMerchantProps) => {
    return (
        <>
            {Object.values(Resources).map((resource: Resources) => (
                <StockpileTile
                    key={resource}
                    resource={resource}
                    value={props.isMerchant ? 0 : props.stockpile[resource]}
                    isCurrentUser={
                        props.isMerchant ? false : props.isCurrentUser
                    }
                    isMerchant={props.isMerchant}
                />
            ))}
        </>
    );
};
