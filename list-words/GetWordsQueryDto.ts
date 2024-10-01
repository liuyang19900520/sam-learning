import { IsOptional, IsString, IsNumber, IsArray, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class GetWordsQueryDto {
  @IsOptional()  // 可选参数
  @IsString()
  word?: string;

  @IsOptional()
  @Type(() => Number)  // 转换为 number 类型
  @IsNumber()
  freq?: number;

  @IsOptional()
  @IsArray()  // typ 是数组
  @IsString({ each: true }) // 确保每个元素都是字符串
  typ?: string[];

  @IsOptional()
  @IsArray()  // lvl 也是数组
  @IsString({ each: true }) // 确保每个元素都是字符串
  lvl?: string[];
}
