import { css } from "linaria";
import { Theme } from "./styles/Theme";
import normalize from "polished/lib/mixins/normalize";
import { styled } from "linaria/react";
import { rem } from "polished";

export const Globals = css`
    :global(body) {
        font-family: "Bitter", serif;
        background-color: ${Theme.colors.primary.background};
        color: ${Theme.colors.primary.color};
    }
    :global(${""}) {
        ${normalize()[0]};

        h1,
        h2,
        h3 {
            text-transform: uppercase;
            letter-spacing: 0.5rem;
            font-weight: 500;
            margin-bottom: 1rem;
            text-align: center;
        }

        @media only screen and (max-width: 500px) {
            h1,
            h2,
            h3,
            h4,
            h5,
            h6,
            p,
            span,
            button,
            input {
                font-size: 1rem;
            }
        }

        html {
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
        }
        *,
        *:before,
        *:after {
            -webkit-box-sizing: inherit;
            -moz-box-sizing: inherit;
            box-sizing: inherit;
        }
    }
`;

export const Logo = styled.img`
    height: 25px;
    margin-top: 1rem;
`;

export const AppLayout = styled.div`
    display: grid;
    grid-template-columns: 1rem 1fr 1rem;
    grid-template-rows: 5rem 1fr;
    grid-template-areas:
        ". logo ."
        ". content .";
    min-height: 100vh;
    justify-content: center;
    align-items: center;
    @media only screen and (min-width: 500px) {
        grid-template-rows: 10rem 1fr;
    }
`;

export const AppWrapper = styled.div`
    position: relative;
    padding: 2rem;
    box-shadow: 0 0 0 1px #202b2b;
    border-radius: ${rem(2)};
`;
