import React from 'react';
import { AppLayout, Globals, Logo } from './App.styles';
import logo from './assets/images/frontier-logo-type.svg';
import { ApolloProvider } from 'react-apollo-hooks';
import { Router } from './Router';
import { AuthenticationWrapper } from './contexts/AuthenticationWrapper';
import { getMainDefinition } from 'apollo-utilities';
import { WebSocketLink } from 'apollo-link-ws';
import { ApolloLink, from, split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

const httpBase = new HttpLink({
    uri: `http${process.env.NODE_ENV === 'production' ? 's' : ''}://${
        process.env.REACT_APP_GQL_URL
    }graphql`,
});

const wsBase = new WebSocketLink({
    uri: `ws${process.env.NODE_ENV === 'production' ? 's' : ''}://${
        process.env.REACT_APP_GQL_URL
    }graphql`,
    options: {
        reconnect: true,
        connectionParams: {
            authorization:
                JSON.parse(localStorage.getItem('frontier_user_token') || '') ||
                null,
        },
    },
});

const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    operation.setContext(({ headers = {} }: any) => ({
        headers: {
            ...headers,
            authorization:
                JSON.parse(localStorage.getItem('frontier_user_token') || '') ||
                null,
        },
    }));

    return forward ? forward(operation) : null;
});

const httpLink = from([authMiddleware, httpBase]);
const wsLink = from([authMiddleware, wsBase]);

const link = split(
    // split based on operation type
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink
);

const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
});

const App = () => {
    return (
        <ApolloProvider client={client}>
            <AppLayout className={Globals}>
                <AuthenticationWrapper>
                    <header>
                        <Logo
                            src={logo}
                            className="App-logo"
                            alt="Frontier board game"
                        />
                        <h2>Let's set a course</h2>
                    </header>
                    <Router />
                </AuthenticationWrapper>
            </AppLayout>
        </ApolloProvider>
    );
};

export default App;
