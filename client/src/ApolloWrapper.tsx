import * as React from 'react';
import { FC } from 'react';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { USER_TOKEN_KEY } from './contexts/AuthenticationWrapper';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { ApolloLink, from, split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloProvider } from '@apollo/react-hooks';

const getUserToken = () => {
    const rawToken = localStorage.getItem(USER_TOKEN_KEY);
    return rawToken && JSON.parse(rawToken);
};

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
            authorization: getUserToken(),
        },
    },
});

const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    operation.setContext(({ headers = {} }: any) => ({
        headers: {
            ...headers,
            authorization: getUserToken(),
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

export const ApolloWrapper: FC = ({ children }) => {
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
