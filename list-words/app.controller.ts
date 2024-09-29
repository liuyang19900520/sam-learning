import {Controller, Get, Res, Query, HttpStatus, Logger, Inject} from '@nestjs/common';
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


  @Get()
  async getWords(@Res() res: Response,
                 @Query() query: GetWordsQueryDto  // 使用 DTO 作为查询参数
  ): Promise<void> {
    this.logger.log(`Query=====: ${JSON.stringify(query)}`); // 输出结果到日志
    try {
      const words = await this.dynamoWordService.getWords(query);
      res.status(HttpStatus.OK).json(words);
    } catch (error) {
      this.logger.error('Error =====', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error fetching data'});
    }
  }
}
