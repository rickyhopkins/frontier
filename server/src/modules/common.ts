import { PubSub } from 'graphql-subscriptions';
import { GraphQLModule } from '@graphql-modules/core';

export const CommonModule = new GraphQLModule({
    providers: [PubSub],
});
