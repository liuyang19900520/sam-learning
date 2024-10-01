import {Controller, Get, Res, Query, HttpStatus, Logger, Inject, Post, Options, Body} from '@nestjs/common';
import {Response} from 'express';
import {DynamoWordService} from './dynamoWord.service';
import {GetWordsQueryDto} from "./GetWordsQueryDto";

@Controller('listWords')
export class AppController {

  private readonly logger = new Logger(AppController.name); // 使用 NestJS 内置的 Logger


  constructor(
    @Inject(DynamoWordService) private readonly dynamoWordService: DynamoWordService
  ) {
    console.log('DynamoService in controller:', this.dynamoWordService);
  }

  @Options()
  handleOptions(@Res() res: Response) {
    res.set({
      'Access-Control-Allow-Origin': 'http://localhost:5173',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true'
    });
    res.status(HttpStatus.NO_CONTENT).send();  // 204 No Content
  }


  @Post()
  async getWords(@Res() res: Response,
                 @Body() query: GetWordsQueryDto  // 使用 DTO 作为查询参数
  ): Promise<void> {
    this.logger.log(`Query=====: ${JSON.stringify(query)}`); // 输出结果到日志

    // 如果 lvl 是字符串而不是数组，强制将其解析为数组
    const parsedQuery = {
      ...query,
      lvl: Array.isArray(query.lvl) ? query.lvl : [query.lvl]
    };
    try {
      const words = await this.dynamoWordService.getWords(parsedQuery);
      res.status(HttpStatus.OK).json(words);
    } catch (error) {
      this.logger.error('Error =====', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error fetching data'});
    }
  }
}
