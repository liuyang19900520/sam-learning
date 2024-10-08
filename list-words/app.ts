// import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
//
// /**
//  *
//  * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
//  * @param {Object} event - API Gateway Lambda Proxy Input Format
//  *
//  * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
//  * @returns {Object} object - API Gateway Lambda Proxy Output Format
//  *
//  */
//
// export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//     try {
//         return {
//             statusCode: 200,
//             body: JSON.stringify({
//                 message: 'liu first test',
//             }),
//         };
//     } catch (err) {
//         console.log(err);
//         return {
//             statusCode: 500,
//             body: JSON.stringify({
//                 message: 'some error happened',
//             }),
//         };
//     }
// };

import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import serverlessExpress from 'aws-serverless-express';
import {ExpressAdapter} from '@nestjs/platform-express';
import express from 'express';
import {APIGatewayProxyEvent, Context} from 'aws-lambda';
import {ValidationPipe} from "@nestjs/common";

const expressApp = express();
let cachedServer: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,  // 确保参数被转换为正确的类型
    }),
  );

  app.enableCors({
    origin: 'http://localhost:5173',  // 允许的前端来源
    methods: 'GET,POST,PUT,DELETE,OPTIONS',  // 允许的请求方法
    allowedHeaders: 'Content-Type, Authorization',  // 允许的请求头
    credentials: true,  // 允许发送 cookies
  });
  await app.init();
  return serverlessExpress.createServer(expressApp);
}

export const lambdaHandler = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }
  return serverlessExpress.proxy(cachedServer, event, context, 'PROMISE').promise;
};
