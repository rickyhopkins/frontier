import * as React from "react";
import { FC } from "react";
import {
    OutlineStyledButton,
    SmallStyledButton,
    StyledButton,
    TertiaryStyledButton,
} from "./Button.styles";
import { Theme } from "../styles/Theme";
import { transparentize } from "polished";
import { cx } from "linaria";

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

export const SmallButton: FC<IProps> = ({ className, ...props }) => {
    return <Button {...props} className={cx(SmallStyledButton, className)} />;
};

export const OutlineButton: FC<IProps> = ({ className, ...props }) => {
    return (
        <StyledButton
            {...props}
            className={cx(OutlineStyledButton, className)}
        />
    );
};

export const TertiaryButton: FC<IProps> = ({ className, ...props }) => {
    return (
        <StyledButton
            {...props}
            className={cx(TertiaryStyledButton, className)}
        />
    );
};
