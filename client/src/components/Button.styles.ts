import { styled } from 'linaria/react';
import { Theme } from '../styles/Theme';

export const StyledButton = styled.button`
    height: 3rem;
    background: ${Theme.colors.primary.color};
    color: white;
    display: inline-block;

    cursor: pointer;
    width: inherit;
    border-radius: 0.2rem;
    padding: 0.5rem 1rem;
    letter-spacing: 0.2rem;
    text-transform: uppercase;
    border: 0;

    :focus {
        outline: -webkit-focus-ring-color auto 1px;
    }
`;
