import gql from "graphql-tag";
import { fullRegistrationSchema } from "./full-registration-schema";

export const REGISTRATION_UPDATED = gql`
    subscription registrationUpdated($gameId: String!) {
        registrationUpdated(gameId: $gameId) {
            ${fullRegistrationSchema}
        }
    }
`;
