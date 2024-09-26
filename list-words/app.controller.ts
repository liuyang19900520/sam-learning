import {Controller, Get, Res, HttpStatus, Logger, Inject} from '@nestjs/common';
import {Response} from 'express';
import {DynamoWordService} from './dynamoWord.service';

@Controller('listWords')
export class AppController {

  private readonly logger = new Logger(AppController.name); // 使用 NestJS 内置的 Logger


  constructor(
    @Inject(DynamoWordService) private readonly dynamoWordService: DynamoWordService
  ) {
    console.log('DynamoService in controller:', this.dynamoWordService);
  }


  @Get()
  async getWords(@Res() res: Response): Promise<void> {
    this.logger.log('try start+++++++++++++++++++++');
    try {
      const words = await this.dynamoWordService.getWords();
      res.status(HttpStatus.OK).json(words);
    } catch (error) {
      this.logger.error('Error =====', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error fetching data'});
    }
  }
}
