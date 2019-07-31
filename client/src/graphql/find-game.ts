import gql from 'graphql-tag';
import { fullGameSchema } from './full-game-schema';

export const FIND_GAME = gql`
    query game($code: String!) {
        game(code: $code) ${fullGameSchema}
    }
`;
