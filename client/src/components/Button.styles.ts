import { styled } from "linaria/react";
import { motion } from "framer-motion";
import { css } from "linaria";

export const StyledButton = styled(motion.button)`
    height: 3rem;
    color: white;
    display: inline-block;

    cursor: pointer;
    width: inherit;
    border-radius: 0.2rem;
    padding: 0.5rem 1rem;
    letter-spacing: 0.2rem;
    text-transform: uppercase;
    border: 0;
`;

export const OutlineButton = css``;
