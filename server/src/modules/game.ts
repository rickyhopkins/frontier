import { GraphQLModule } from '@graphql-modules/core';
import * as typeDefs from './game.graphql';
import resolvers from './game.resolvers';
import { AuthModule } from '@modules/auth';

export const GameModule = new GraphQLModule({
    name: 'game',
    imports: [AuthModule],
    typeDefs,
    resolvers,
});
