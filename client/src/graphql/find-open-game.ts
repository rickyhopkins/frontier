import gql from 'graphql-tag';

export const FIND_OPEN_GAME = gql`
    query findOpenGame($code: String!) {
        findOpenGame(code: $code) {
            code
        }
    }
`;
