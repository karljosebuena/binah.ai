import { IFCVProcessor } from './fcv-processor.interface';
import { TestType } from '../value-objects/test-type.vo';
import { ConfidenceScore } from '../value-objects/confidence-score.vo';
import { ProcessingStatus, ProcessingStatusVO } from '../value-objects/processing-status.vo';

export class FCVProcessorService implements IFCVProcessor {
  async processSample(
    filePath: string,
    testType: TestType,
  ): Promise<{
    confidenceScore: ConfidenceScore;
    status: ProcessingStatusVO;
  }> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Random outcome generator (0-1)
    const outcome = Math.random();

    // 70% chance of success, 15% error, 15% failure
    if (outcome < 0.15) {
      // Simulate processing failure
      return {
        confidenceScore: ConfidenceScore.create(0),
        status: new ProcessingStatusVO(ProcessingStatus.COMPLETE_FAILURE),
      };
    } else if (outcome < 0.30) {
      // Simulate processing error
      return {
        confidenceScore: ConfidenceScore.create(0),
        status: new ProcessingStatusVO(ProcessingStatus.COMPLETE_ERROR),
      };
    } else {
      // Generate random confidence score between 0 and 1
      const randomScore = Math.random();
      return {
        confidenceScore: ConfidenceScore.create(randomScore),
        status: new ProcessingStatusVO(ProcessingStatus.COMPLETE_SUCCESS),
      };
    }
  }
}
