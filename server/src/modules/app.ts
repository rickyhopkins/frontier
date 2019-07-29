import { GraphQLModule } from '@graphql-modules/core';
import { PlayerModule } from './player';
import { CommonModule } from './common';
import { resolversComposition } from './resolvers';
import { AuthModule } from './auth';
import { GameModule } from './game';

export const AppModule = new GraphQLModule({
    name: 'app',
    imports: [AuthModule, CommonModule, PlayerModule, GameModule],
    resolversComposition,
});
