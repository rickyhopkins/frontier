import { GraphQLModule } from "@graphql-modules/core";
import * as typeDefs from "./registration.graphql";
import resolvers from "./registration.resolvers";
import { AuthModule } from "./auth";

export const RegistrationModule = new GraphQLModule({
    name: "registration",
    imports: [AuthModule],
    typeDefs,
    resolvers,
});
