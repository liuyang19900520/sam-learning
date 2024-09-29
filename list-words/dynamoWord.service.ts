import {Injectable, Logger} from '@nestjs/common';
import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient, ScanCommand} from '@aws-sdk/lib-dynamodb';
import {GetWordsQueryDto} from "./GetWordsQueryDto";

@Injectable()
export class DynamoWordService {
  private readonly dynamoDBClient: DynamoDBClient;
  private readonly docClient: DynamoDBDocumentClient;
  private readonly logger = new Logger(DynamoWordService.name); // 使用 NestJS 内置的 Logger

  constructor() {
    console.log('DynamoWordService starting initialized'); // 添加日志
    try {
      this.dynamoDBClient = new DynamoDBClient({region: 'ap-northeast-1'}); // 指定你的 AWS 区域
      this.docClient = DynamoDBDocumentClient.from(this.dynamoDBClient);
    } catch (error) {
      this.logger.error('DB connect', error);
      throw error;
    }
    console.log('DynamoWordService finish initialized'); // 添加日志

  }

  // 获取 DynamoDB 中的数据
  async getWords(query: GetWordsQueryDto): Promise<any[]> {

    const { word, freq, typ, lvl } = query;
    const params = {
      TableName: 'words', // 替换为你的 DynamoDB 表名
      ProjectionExpression: 'word, freq' // 只返回 word 和 freq 字段
    };

    this.logger.log('Executing ScanCommand for DynamoDB');

    try {
      const data = await this.docClient.send(new ScanCommand(params));
      this.logger.log(`DynamoDB Scan returned: ${JSON.stringify(data.Items)}`); // 输出结果到日志
      return data.Items || [];
    } catch (error) {
      this.logger.error('Error fetching data from DynamoDB', error);
      throw error;
    }
  }
}
