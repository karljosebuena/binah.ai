import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SampleSchema } from '../../infrastructure/database/schemas/sample.schema';
import { TestResultSchema } from '../../infrastructure/database/schemas/test-result.schema';
import { MongoSampleRepository } from '../../infrastructure/repositories/mongo-sample.repository';
import { MongoTestResultRepository } from '../../infrastructure/repositories/mongo-test-result.repository';
import { FCVValidatorService } from '../../domain/services/fcv-validator.service';
import { FCVProcessorService } from '../../domain/services/fcv-processor.service';
import { SampleProcessingService } from '../../application/services/sample-processing.service';
import { SampleController } from '../../presentation/http/controllers/sample.controller';
import { StorageService } from '../../infrastructure/storage/storage.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Sample', schema: SampleSchema },
      { name: 'TestResult', schema: TestResultSchema },
    ]),
  ],
  controllers: [SampleController],
  providers: [
    {
      provide: 'IFCVValidator',
      useClass: FCVValidatorService,
    },
    {
      provide: 'IFCVProcessor',
      useClass: FCVProcessorService,
    },
    {
      provide: 'ISampleRepository',
      useClass: MongoSampleRepository,
    },
    {
      provide: 'ITestResultRepository',
      useClass: MongoTestResultRepository,
    },
    StorageService,
    SampleProcessingService,
  ],
  exports: [SampleProcessingService],
})
export class SampleModule {}
