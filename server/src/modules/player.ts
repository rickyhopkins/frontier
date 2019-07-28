import { GraphQLModule } from '@graphql-modules/core';
import * as typeDefs from './player.graphql';
import resolvers from './player.resolvers';
import { AuthModule } from '@modules/auth';

export const PlayerModule = new GraphQLModule({
    name: 'player',
    imports: [AuthModule],
    typeDefs,
    resolvers,
});
