import * as React from 'react';
import { StyledInput } from './Input.styles';
import { LoginHint } from '../pages/Login.styles';

type InputProps = JSX.IntrinsicElements['input'];

interface IProps extends InputProps {
    hint?: string;
    error?: string;
}

export const Input = ({ hint, error, ...props }: IProps) => {
    return (
        <div>
            <StyledInput {...props} />
            {hint && <LoginHint>{hint}</LoginHint>}
            {error && <LoginHint>{error}</LoginHint>}
        </div>
    );
};
