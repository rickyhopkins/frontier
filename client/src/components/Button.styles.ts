import { styled } from "linaria/react";
import { motion } from "framer-motion";
import { css } from "linaria";

export const StyledButton = styled(motion.button)`
    height: 3rem;
    color: white;
    fill: white;
    display: inline-block;

    cursor: pointer;
    border-radius: 0.2rem;
    padding: 0.5rem 1rem;
    letter-spacing: 0.2rem;
    text-transform: uppercase;
    border: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:disabled {
        opacity: 0.1;
    }
`;

export const SmallStyledButton = css`
    padding: 0.25rem;
    height: 2rem;
    font-size: 0.75rem;
`;

export const OutlineStyledButton = css`
    color: gray;
    border: 1px solid #505050;
    background-color: transparent;
`;

export const TertiaryStyledButton = css`
    background-color: transparent;
    padding: 0.5rem;
    height: 2rem;
    font-size: 1rem;
    line-height: 1rem;
`;
