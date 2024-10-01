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

  async getWords(query: GetWordsQueryDto): Promise<any[]> {
    const { word, freq, typ, lvl } = query;

    // 将 freq 转换为 number，如果它存在
    const freqNumber = freq ? Number(freq) : undefined

    // 构建基础的 DynamoDB Scan 参数
    const params: any = {
      TableName: 'words', // 替换为你的 DynamoDB 表名
      ProjectionExpression: '#lvl, word, freq, typ', // 使用别名 #lvl
      ExpressionAttributeNames: { '#lvl': 'lvl' },  // lvl 是保留字，使用别名
    };

    const filters: string[] = [];
    params.ExpressionAttributeValues = {};

    // 模糊查询 word
    if (word) {
      filters.push('contains(#word, :word)');
      params.ExpressionAttributeValues[':word'] = word;
      params.ExpressionAttributeNames['#word'] = 'word'; // 使用别名 #word
    }

    // 查询 freq 大于传入值
    if (freqNumber !== undefined && !isNaN(freqNumber)) {
      filters.push('freq > :freq');
      params.ExpressionAttributeValues[':freq'] = freqNumber;
    }

    // 查询 typ 在传入的数组中
    if (typ && typ.length > 0) {
      const typFilters: string[] = [];
      typ.forEach((item, index) => {
        const key = `:typ${index}`;
        typFilters.push(key);
        params.ExpressionAttributeValues[key] = item;
      });
      filters.push(`typ IN (${typFilters.join(', ')})`);
    }

    // 查询 lvl 在传入的数组中
    if (lvl && lvl.length > 0) {
      const lvlFilters: string[] = [];
      lvl.forEach((item, index) => {
        const key = `:lvl${index}`;
        lvlFilters.push(key);
        params.ExpressionAttributeValues[key] = item;
      });
      filters.push(`#lvl IN (${lvlFilters.join(', ')})`); // 使用别名 #lvl
    }

    // 拼接过滤条件
    if (filters.length > 0) {
      params.FilterExpression = filters.join(' AND ');
    } else {
      delete params.ExpressionAttributeValues;
    }

    this.logger.log('Executing ScanCommand with params:', params);

    try {
      const data = await this.docClient.send(new ScanCommand(params));
      this.logger.log(`DynamoDB Scan returned: ${JSON.stringify(data.Items)}`);
      return data.Items || [];
    } catch (error) {
      this.logger.error('Error fetching data from DynamoDB', error);
      throw error;
    }
  }

}
