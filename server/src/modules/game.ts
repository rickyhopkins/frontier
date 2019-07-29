import { GraphQLModule } from '@graphql-modules/core';
import * as typeDefs from './game.graphql';
import resolvers from './game.resolvers';
import { CommonModule } from './common';
import { AuthModule } from './auth';

export const GameModule = new GraphQLModule({
    name: 'game',
    imports: [AuthModule, CommonModule],
    typeDefs,
    resolvers,
});
