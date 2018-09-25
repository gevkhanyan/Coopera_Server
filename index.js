import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import jwt from 'jsonwebtoken';
import { fileLoader, mergeResolvers, mergeTypes } from 'merge-graphql-schemas';
import path from 'path';
import { refreshTokens } from './auth';

import models from './models';

const SECRET = '6PkQjNQv7fAgZH70XVlGgu95Fw4VKHW7ZbbYMooP';
const SECRET2 = 'xMXi05B8QaXmN3hTqlqBAc457xgT7RiFsb9o6s5jfAgZH70XVlGgu9';

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')), { all: true });
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const PORT = 8081;
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => ({
        models,
        user: req.user,
        SECRET,
        SECRET2,
    }),
});

const app = express();

const userAuth = async (req, res, next) => {
    const token = req.headers['x-token'];
    if (token) {
        try {
            const { user } = jwt.verify(token, SECRET);
            req.user = user;
            console.log(req.user);
        } catch (err) {
            const refreshToken = req.headers['x-refresh-token'];
            const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);
            if (newTokens.token && newTokens.refreshToken) {
                res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
                res.set('x-token', newTokens.token);
                res.set('x-refresh-token', newTokens.refreshToken);
            }
            req.user = newTokens.user;
        }
    }
    next();
};

app.use(userAuth);

server.applyMiddleware({ app });

models.sequelize.sync({}).then(() => { app.listen(PORT); });
