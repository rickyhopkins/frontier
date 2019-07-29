import { GraphQLModule } from '@graphql-modules/core';
import * as typeDefs from './game.graphql';
import resolvers from './game.resolvers';
import { AuthModule } from '@modules/auth';
import { CommonModule } from '@modules/common';

export const GameModule = new GraphQLModule({
    name: 'game',
    imports: [AuthModule, CommonModule],
    typeDefs,
    resolvers,
});
