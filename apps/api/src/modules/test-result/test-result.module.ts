import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestResultSchema } from '../../infrastructure/database/schemas/test-result.schema';
import { MongoTestResultRepository } from '../../infrastructure/repositories/mongo-test-result.repository';
import { ResultInterpreterService } from '../../domain/services/result-interpreter.service';
import { TestResultService } from '../../application/services/test-result.service';
import { TestResultController } from '../../presentation/http/controllers/test-result.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'TestResult', schema: TestResultSchema },
    ]),
  ],
  controllers: [TestResultController],
  providers: [
    {
      provide: 'IResultInterpreter',
      useClass: ResultInterpreterService,
    },
    {
      provide: 'ITestResultRepository',
      useClass: MongoTestResultRepository,
    },
    TestResultService,
  ],
  exports: [TestResultService],
})
export class TestResultModule {}
