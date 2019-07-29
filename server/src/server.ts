import 'graphql-import-node';
import 'reflect-metadata';
import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server';
import { verify } from 'jsonwebtoken';
import { AppModule } from './modules/app';

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

mongoose.connect(
    `mongodb://frontier_app:${process.env.MONGO_PW}@ds050869.mlab.com:50869/frontier`,
    { useNewUrlParser: true }
);
const { ObjectId } = mongoose.Types;
ObjectId.prototype.valueOf = function() {
    return this.toString();
};

const server = new ApolloServer({
    modules: [AppModule],
    cors: {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    },
    context: ({ req, connection }: any) => {
        const { authorization: token = '' } =
            (req && req.headers) || connection.context;

        try {
            if (token) {
                const parsedToken: any = verify(token, 'secrets');

                return {
                    token,
                    user: parsedToken.user,
                };
            }
        } catch (e) {
            console.warn(`Unable to authenticate using auth token: ${token}`);
        }

        return {
            token,
        };
    },
});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
