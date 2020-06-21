import 'reflect-metadata';
import kcors from 'kcors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import { validateToken, getUserIDByToken } from './utils/authorization';
import { useKoaServer, useContainer, Action } from 'routing-controllers';
import { Container } from 'typedi';
import config from './config';
import { getConnectionManager, Connection } from 'typeorm';
import path from 'path';

const { dbUser, dbName, dbHost, dbPassword, dbPort } = config;

const connectionManager = getConnectionManager();
const connection: Connection = connectionManager.create({
  type: 'mysql',
  host: dbHost,
  port: dbPort,
  username: dbUser,
  password: dbPassword,
  database: dbName,
  entities: [
    path.resolve(__dirname, './entities/*.ts'),
  ],
  synchronize: true,
});

connection.connect().then(() => {
  const app = new Koa();

  app.use(async(ctx, next): Promise<any> => {
    try { await next(); } catch (e) {
      ctx.status = e.status || e.httpCode || 403;
      ctx.body = {
        status: ctx.status || 403,
        message: e.message,
        data: e.errors ? e.errors : {},
      };
    }
  });

  app.use(kcors());

  app.use(bodyParser());

  if (config.isDev) app.use(logger());

  const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

  useContainer(Container);
  useKoaServer(app, {
    routePrefix: '/api',
    controllers: [__dirname + '/modules/**/*.controller.{ts,js}'],
    middlewares: [__dirname + '/middlewares/*.{ts,js}'],
    authorizationChecker: async (action: Action) => validateToken(action.request.headers['authorization']),
    currentUserChecker: async (action: Action) => getUserIDByToken(action.request.headers['authorization']).uuid,
    defaults: {
      paramOptions: { required: false },
    },
    defaultErrorHandler: false,
    classTransformer: false,
  }).listen(port);
});


