import {Module, OnModuleInit} from '@nestjs/common';
import { AppController } from './app.controller';
import { DynamoWordService } from './dynamoWord.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.prettyPrint()
          ),
        }),
      ],
    }),
  ],
  controllers: [AppController],
  providers: [DynamoWordService],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    console.log('AppModule initialized, DynamoWordService should be ready');
  }
}
