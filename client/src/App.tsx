import React from "react";
import { AppLayout, Globals } from "./App.styles";
import { Router } from "./Router";
import { AuthenticationWrapper } from "./contexts/AuthenticationWrapper";
import { ApolloWrapper } from "./ApolloWrapper";
import { Header } from "./components/Header";
import { styled } from "linaria/react";

const Content = styled.div`
    grid-area: content;
    height: 100%;
`;

const App = () => {
    return (
        <ApolloWrapper>
            <AppLayout className={Globals}>
                <Header />
                <Content>
                    <AuthenticationWrapper>
                        <Router />
                    </AuthenticationWrapper>
                </Content>
            </AppLayout>
        </ApolloWrapper>
    );
};

export default App;
