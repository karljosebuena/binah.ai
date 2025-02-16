import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { TestType } from '../../domain/value-objects/test-type.vo';

export class SampleUploadDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [value];
      }
    }
    return value;
  })
  testTypes: TestType[];

  // File will be handled by NestJS FileInterceptor
  file: Express.Multer.File;
}
