import { GraphQLModule } from '@graphql-modules/core';
import { AuthModule } from '@modules/auth';
import { PlayerModule } from '@modules/player';
import { GameModule } from '@modules/game';
import { resolversComposition } from '@modules/resolvers';

export const AppModule = new GraphQLModule({
    name: 'app',
    imports: [AuthModule, PlayerModule, GameModule],
    resolversComposition,
});
