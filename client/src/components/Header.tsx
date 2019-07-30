import * as React from 'react';
import { Logo } from '../App.styles';
import logo from '../assets/images/frontier-logo-type.svg';
import { HeaderWrapper } from './Header.styles';

export const Header = () => {
    return (
        <HeaderWrapper>
            <Logo src={logo} alt="Frontier board game" />
        </HeaderWrapper>
    );
};
