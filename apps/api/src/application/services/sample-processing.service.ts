import { Injectable, Inject } from '@nestjs/common';
import { IFCVValidator } from '../../domain/services/fcv-validator.interface';
import { IFCVProcessor } from '../../domain/services/fcv-processor.interface';
import * as crypto from 'crypto';
import { ConfidenceScore } from '../../domain/value-objects/confidence-score.vo';
import { ISampleRepository } from '../interfaces/sample.repository.interface';
import { ITestResultRepository } from '../interfaces/test-result.repository.interface';
import { Sample } from '../../domain/entities/sample.entity';
import { TestResult } from '../../domain/entities/test-result.entity';
import { SampleUploadDto } from '../dtos/sample-upload.dto';
import { TestType } from '../../domain/value-objects/test-type.vo';
import { ProcessingStatus, ProcessingStatusVO } from '../../domain/value-objects/processing-status.vo';
import { StorageService } from '../../infrastructure/storage/storage.service';

@Injectable()
export class SampleProcessingService {
  constructor(
    @Inject('IFCVValidator')
    private readonly fcvValidator: IFCVValidator,
    @Inject('IFCVProcessor')
    private readonly fcvProcessor: IFCVProcessor,
    @Inject('ISampleRepository')
    private readonly sampleRepository: ISampleRepository,
    @Inject('ITestResultRepository')
    private readonly testResultRepository: ITestResultRepository,
    private readonly storageService: StorageService,
  ) {}

  async processSampleUpload(dto: SampleUploadDto): Promise<string> {
    let filePath: string | null = null;
    
    try {
      console.log('Processing sample upload:', {
        userId: dto.userId,
        testTypes: dto.testTypes,
        fileName: dto.file.originalname
      });
      // Save file and get path
      filePath = await this.storageService.saveFile(dto.file);

      // Validate file format
      const isValidFormat = await this.fcvValidator.validateFileFormat(filePath);
      if (!isValidFormat) {
        throw new Error('Invalid file format');
      }

      // Create and save sample
      const sample = new Sample(
        crypto.randomUUID?.() || Date.now().toString(),
        dto.userId,
        filePath,
        dto.testTypes,
        6, // TODO: Implement actual cough count detection
        new Date(),
      );
    
      try {
        await this.sampleRepository.save(sample);
      } catch (error) {
        throw new Error(`Failed to save sample: ${error.message}`);
      }

      // Process each test type
      try {
        for (const testType of dto.testTypes) {
          await this.processTestType(sample, testType);
        }
      } catch (error) {
        // If test processing fails, we still keep the sample but log the error
        console.error(`Test processing failed for sample ${sample.getId()}: ${error.message}`);
      }

      return sample.getId();
    } catch (error) {
      // Clean up file if it was saved
      if (filePath) {
        await this.storageService.deleteFile(filePath);
      }
      
      throw new Error(`Sample upload failed: ${error.message}`);
    }
  }

  private async processTestType(sample: Sample, testType: TestType): Promise<void> {
    try {
      const result = await this.fcvProcessor.processSample(
        sample.getFilePath(),
        testType,
      );

      const testResult = new TestResult(
        crypto.randomUUID(),
        sample.getId(),
        sample.getUserId(),
        testType,
        result.confidenceScore,
        result.status,
        new Date(),
        new Date(),
      );

      const savedResult = await this.testResultRepository.save(testResult);
      console.log('Saved test result:', savedResult);
    } catch (error) {
      // Save failed result
      const testResult = new TestResult(
        crypto.randomUUID(),
        sample.getId(),
        sample.getUserId(),
        testType,
        ConfidenceScore.create(0),
        new ProcessingStatusVO(ProcessingStatus.COMPLETE_ERROR),
        new Date(),
        new Date(),
      );

      await this.testResultRepository.save(testResult);
      throw error;
    }
  }
}
