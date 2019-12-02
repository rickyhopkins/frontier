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
    PROPOSE_TRADE: gql`
        mutation proposeTrade($code: String!, $trade: TradeInput!) {
            proposeTrade(code: $code, trade: $trade)
        }
    `,
    ACCEPT_TRADE: gql`
        mutation acceptTrade($code: String!, $tradeId: ID!) {
            acceptTrade(code: $code, tradeId: $tradeId)
        }
    `,
    REJECT_TRADE: gql`
        mutation rejectTrade($code: String!, $tradeId: ID!) {
            rejectTrade(code: $code, tradeId: $tradeId)
        }
    `,
};
