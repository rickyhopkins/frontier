import * as React from "react";
import { useRequiredContext } from "../../hooks/useRequiredContext";
import { Resources } from "../../@types/frontier";
import { styled } from "linaria/react";
import iron from "../../assets/images/iron.png";
import livestock from "../../assets/images/livestock.png";
import stone from "../../assets/images/stone.png";
import wheat from "../../assets/images/wheat.png";
import wood from "../../assets/images/wood.png";
import { Theme } from "../../styles/Theme";
import {
    MERCHANT_TRADER_ID,
    PurchasingActionTypes,
} from "./Purchasing.reducer";
import { PurchasingContext } from "./Purchasing";
import { css, cx } from "linaria";
import { motion } from "framer-motion";
import { useMemo } from "react";

interface IProps {
    resource: Resources;
    value: number;
    isCurrentUser?: boolean;
    isMerchant?: boolean;
}

const Tile = styled(motion.div)`
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    align-items: center;
    background-color: ${Theme.colors.contrast.background};
    margin: 0.25rem;
    border-radius: 4px;
    user-select: none;

    span {
        color: #fff;
        font-size: 1.1rem;
    }

    img {
        height: 3rem;
    }
`;

const DisabledTile = css`
    opacity: 0.5;
`;

export const StockpileTile = ({
    resource,
    value,
    isCurrentUser,
    isMerchant,
}: IProps) => {
    const { state, dispatch } = useRequiredContext(PurchasingContext);
    const tradeValueForThisResource = state.trade[resource] || 0;

    const tradingValue = useMemo<number>(() => {
        if (isMerchant) {
            return tradeValueForThisResource < 0 ? 4 : 1;
        } else if (state.tradingWith === MERCHANT_TRADER_ID) {
            return tradeValueForThisResource <= 0 ? 4 : 1;
        } else {
            return 1;
        }
    }, [isMerchant, state.tradingWith, tradeValueForThisResource]);

    const iconSrc = (() => {
        switch (resource) {
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

    const onClick = () => {
        dispatch({
            type: PurchasingActionTypes.ADD_TO_TRADE,
            resource,
            amount: isCurrentUser ? -tradingValue : tradingValue,
        });
    };

    const resourceCount = useMemo<number>(() => {
        if (isMerchant) {
            if (tradeValueForThisResource < 0)
                return Math.abs(tradeValueForThisResource);
            return Object.values(state.trade).reduce<number>(
                (count, tradeValue) => {
                    if (!tradeValue) return count;
                    if (tradeValue < 0) {
                        return count + Math.abs(tradeValue) / 4;
                    }
                    return count - tradeValue;
                },
                0
            );
        }
        return value + tradeValueForThisResource * (isCurrentUser ? 1 : -1);
    }, [
        isCurrentUser,
        isMerchant,
        value,
        state.trade,
        tradeValueForThisResource,
    ]);

    const disabled = useMemo(() => {
        if (isMerchant) {
            return resourceCount <= 0;
        }
        return (
            state.tradingWith &&
            resourceCount < (state.tradingWith === MERCHANT_TRADER_ID ? 4 : 1)
        );
    }, [state.tradingWith, resourceCount, isMerchant]);

    return (
        <Tile
            onClick={!state.tradingWith || disabled ? undefined : onClick}
            className={cx(disabled && DisabledTile)}
            positionTransition
        >
            <img src={iconSrc} alt={resource} />
            <span>{resourceCount}</span>
        </Tile>
    );
};
