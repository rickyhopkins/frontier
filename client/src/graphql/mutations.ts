import gql from "graphql-tag";
import { fullRegistrationSchema } from "./full-registration-schema";
import { fullGameSchema } from "./full-game-schema";

export const GameMutations = {
    REGISTER: gql`
        mutation register($code: String!) {
            register(code: $code) {
                _id
            }
        }
    `,
    NEXT_STAGE: gql`
        mutation nextStage($code: String!) {
            nextStage(code: $code) ${fullGameSchema}
        }
    `,
    ADD_RESOURCE: gql`
        mutation addResource(
            $registrationId: ID!
            $resource: String!
            $value: Int!
        ) {
            addResource(
                registrationId: $registrationId
                resource: $resource
                value: $value
            ) {
                ${fullRegistrationSchema}
            }
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
    END_TURN: gql`
        mutation endTurn($gameId: ID!) {
            endTurn(gameId: $gameId) {
                ${fullRegistrationSchema}
            }
        }
    `,
};
