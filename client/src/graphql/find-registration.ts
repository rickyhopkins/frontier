import gql from "graphql-tag";
import { fullRegistrationSchema } from "./full-registration-schema";

export const FIND_REGISTRATION = gql`
    query registration($id: String!) {
        registration(id: $id) {
            ${fullRegistrationSchema}
        }
    }
`;
