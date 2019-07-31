import gql from 'graphql-tag';

export const GameMutations = {
    REGISTER: gql`
        mutation register($code: String!) {
            register(code: $code)
        }
    `,
};
