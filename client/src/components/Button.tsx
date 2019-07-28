import * as React from 'react';
import { StyledButton } from './Button.styles';

type ButtonProps = JSX.IntrinsicElements['button'];

interface IProps extends ButtonProps {}

export const Button = (props: IProps) => {
    return <StyledButton {...props} />;
};
