import { Controller, Post, Body, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SampleProcessingService } from '../../../application/services/sample-processing.service';
import { SampleUploadDto } from '../../../application/dtos/sample-upload.dto';
import { AuthGuard } from '../../../infrastructure/auth/auth.guard';

@Controller({
  path: 'samples',
  version: '1'
})
@UseGuards(AuthGuard)
export class SampleController {
  constructor(
    private readonly sampleProcessingService: SampleProcessingService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSample(
    @Body() dto: SampleUploadDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ sampleId: string }> {
    if (!file) {
      throw new Error('No file uploaded');
    }
    dto.file = file;
    const sampleId = await this.sampleProcessingService.processSampleUpload(dto);
    return { sampleId };
  }
}
