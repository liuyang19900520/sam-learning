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
  @Type(() => Number)  // 确保 typ 数组的每个值是 number
  @ArrayMinSize(1)
  typ?: number[];

  @IsOptional()
  @IsArray()  // lvl 也是数组
  @Type(() => Number)
  @ArrayMinSize(1)
  lvl?: number[];
}
