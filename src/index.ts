import { ConfirmUserResolver } from './modules/user/ConfirmUser';
import { MeResolver } from './modules/user/Me';
import { LoginResolver } from './modules/user/Login';
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';

import { RegisterResolver } from './modules/user/Register';
import { redis } from './redis';

const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [MeResolver, RegisterResolver, LoginResolver, ConfirmUserResolver],
    authChecker: ({ context: { req } }) => {
      if (req.session.userId) {
        return true;
      }
      return false;
    },
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => ({ req }),
  });

  const app = Express();

  const RedisStore = connectRedis(session);

  app.use(
    cors({
      credentials: true,
      origin: 'http://localhost:3000',
    })
  );

  app.use(
    session({
      store: new RedisStore({
        client: redis,
      }),
      name: 'qid',
      secret: 'my_cookie_secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    })
  );

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('Server running on port 4000');
  });
};

main();
