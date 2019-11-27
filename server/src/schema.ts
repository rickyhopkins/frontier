import { AppModule } from "./modules/app";

console.log(AppModule.schema);
// Get typeDefs from top module, and export it
export default AppModule.typeDefs;
