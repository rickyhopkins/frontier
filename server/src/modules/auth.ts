import { GraphQLModule } from '@graphql-modules/core';
import * as typeDefs from './auth.graphql';

export const AuthModule = new GraphQLModule({
    name: 'auth',
    typeDefs,
    resolvers: {
        Query: {
            me: (root, args, { user }) => user,
        },
        User: {
            id: user => user._id,
            username: user => user.username,
        },
    },
});
