import * as React from "react";

export const TradingTile = ({ value }: { value?: number }) => {
    if (!value) return <div />;
    return (
        <div>
            {value}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 30 30"
                style={{
                    stroke: "#fff",
                    fill: "none",
                    strokeLinecap: "round",
                    transform: "scale(-1,1), translate(0px,-100px)",
                    strokeWidth: "2",
                }}
            >
                <path d="M28 15L2 15" />
                <path
                    d={value < 0 ? "M20 6L29 15L20 24" : "M10 6L1 15L10 24"}
                />
            </svg>
        </div>
    );
};
