import { Controller, Post, Body, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { SampleProcessingService } from '../../../application/services/sample-processing.service';
import { SampleUploadDto } from '../../../application/dtos/sample-upload.dto';
import { AuthGuard } from '../../../infrastructure/auth/auth.guard';
import { InvalidSampleException } from '../../../shared/exceptions/domain.exceptions';

@ApiTags('Samples')
@ApiBearerAuth()
@Controller({
  path: 'samples',
  version: '1'
})
@UseGuards(AuthGuard)
export class SampleController {
  constructor(
    private readonly sampleProcessingService: SampleProcessingService,
  ) {}

  @ApiOperation({ summary: 'Upload a new cough sample for analysis' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Audio file containing cough samples',
        },
        userId: {
          type: 'string',
          description: 'User ID from Clerk authentication',
        },
        testTypes: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['TB', 'COVID19', 'SMOKING'],
          },
          description: 'Array of test types to run',
        },
      },
    },
  })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSample(
    @Body() dto: SampleUploadDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ sampleId: string }> {
    if (!file) {
      throw new InvalidSampleException('No file uploaded');
    }
    dto.file = file;
    const sampleId = await this.sampleProcessingService.processSampleUpload(dto);
    return { sampleId };
  }
}
