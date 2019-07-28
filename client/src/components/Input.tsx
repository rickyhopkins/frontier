import * as React from 'react';
import { StyledInput } from './Input.styles';

type InputProps = JSX.IntrinsicElements['input'];

interface IProps extends InputProps {}

export const Input = (props: IProps) => {
    return <StyledInput {...props} />;
};
