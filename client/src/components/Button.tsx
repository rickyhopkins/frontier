import * as React from "react";
import { FC } from "react";
import { StyledButton } from "./Button.styles";
import { Theme } from "../styles/Theme";
import { transparentize } from "polished";

type ButtonProps = JSX.IntrinsicElements["button"];

interface IProps extends ButtonProps {
    outline?: boolean;
    onAnimationStart?: any;
    onDragStart?: any;
    onDragEnd?: any;
    onDrag?: any;
    ref?: any;
}

export const Button: FC<IProps> = ({ disabled, ...props }) => {
    const variants = {
        enabled: { background: Theme.colors.primary.color },
        disabled: {
            background: transparentize(0.3, Theme.colors.primary.color),
        },
    };

    return (
        <StyledButton
            {...props}
            disabled={disabled}
            variants={variants}
            animate={disabled ? "disabled" : "enabled"}
        />
    );
};
