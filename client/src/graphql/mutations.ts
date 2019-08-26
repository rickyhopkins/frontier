import gql from "graphql-tag";

export const GameMutations = {
    REGISTER: gql`
        mutation register($code: String!) {
            register(code: $code)
        }
    `,
    NEXT_STAGE: gql`
        mutation nextStage($code: String!) {
            nextStage(code: $code)
        }
    `,
    ADD_RESOURCE: gql`
        mutation addResource(
            $code: String!
            $registrationId: ID!
            $resource: String!
            $value: Int!
        ) {
            addResource(
                code: $code
                registrationId: $registrationId
                resource: $resource
                value: $value
            )
        }
    `,
};
