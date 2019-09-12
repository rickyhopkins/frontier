import * as React from "react";
import { styled } from "linaria/react";

const TradingTileWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const TradingArrow = styled.svg`
    stroke: #fff;
    fill: none;
    stroke-linecap: round;
    stroke-width: 2px;
    width: 2rem;
`;

export const TradingTile = ({ value }: { value?: number }) => {
    if (!value) return <div />;
    return (
        <TradingTileWrapper>
            {Math.abs(value)}
            <TradingArrow
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 30 30"
            >
                <path d="M28 15L2 15" />
                <path
                    d={value < 0 ? "M20 6L29 15L20 24" : "M10 6L1 15L10 24"}
                />
            </TradingArrow>
        </TradingTileWrapper>
    );
};
