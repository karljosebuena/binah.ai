import { ITestResultRepository } from '../interfaces/test-result.repository.interface';
import { TestResultDto } from '../dtos/test-result.dto';
import { TestType } from '../../domain/value-objects/test-type.vo';
import { IResultInterpreter } from '../../domain/services/result-interpreter.interface';

import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class TestResultService {
  constructor(
    @Inject('ITestResultRepository')
    private readonly testResultRepository: ITestResultRepository,
    @Inject('IResultInterpreter')
    private readonly resultInterpreter: IResultInterpreter,
  ) {}

  async getUserResults(userId: string): Promise<TestResultDto[]> {
    console.log('Getting results for user:', userId);
    const results = await this.testResultRepository.findByUserId(userId);
    console.log('Found results:', results);
    return results.map(result => this.mapToDto(result));
  }

  async getUserResultsByType(userId: string, testType: TestType): Promise<TestResultDto[]> {
    const results = await this.testResultRepository.findByUserIdAndTestType(userId, testType);
    return results.map(result => this.mapToDto(result));
  }

  private mapToDto(result: any): TestResultDto {
    const interpretation = this.resultInterpreter.interpretResult(
      result.getTestType(),
      result.getConfidenceScore(),
    );

    return {
      id: result.getId(),
      sampleId: result.getSampleId(),
      userId: result.getUserId(),
      testType: result.getTestType(),
      confidenceScore: result.getConfidenceScore().getValue(),
      processingStatus: result.getProcessingStatus().getValue(),
      interpretation: interpretation.interpretation,
      recommendation: interpretation.recommendation,
      createdAt: result.getCreatedAt(),
      updatedAt: result.getUpdatedAt(),
    };
  }
}
