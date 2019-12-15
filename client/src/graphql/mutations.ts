import gql from "graphql-tag";
import { fullRegistrationSchema } from "./full-registration-schema";

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
    BUY_UNIT: gql`
        mutation buyUnit($registrationId: ID!, $unit: String!) {
            buyUnit(registrationId: $registrationId, unit: $unit) {
                ${fullRegistrationSchema}
            }
        }
    `,
    SELL_UNIT: gql`
        mutation sellUnit($registrationId: ID!, $unit: String!) {
            sellUnit(registrationId: $registrationId, unit: $unit) {
                ${fullRegistrationSchema}
            }
        }
    `,
};
