import gql from 'graphql-tag';

export const CREATE_PLAYER = gql`
    mutation createPlayer($name: String!) {
        createPlayer(name: $name)
    }
`;
