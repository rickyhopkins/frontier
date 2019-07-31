import gql from 'graphql-tag';
import { fullGameSchema } from './full-game-schema';

export const GAME_UPDATED = gql`
    subscription gameUpdated($code: String!) {
        gameUpdated(code: $code) ${fullGameSchema}
    }
`;
