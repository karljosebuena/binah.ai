import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TestType } from '../../domain/value-objects/test-type.vo';

export class SampleUploadDto {
  @ApiProperty({
    description: 'User ID from Clerk authentication',
    example: 'user_123'
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Array of test types to run',
    enum: TestType,
    isArray: true,
    example: ['TB', 'COVID19']
  })
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
