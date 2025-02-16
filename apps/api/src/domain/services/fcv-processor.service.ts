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
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate random confidence score between 0 and 1
      const randomScore = Math.random();
      const confidenceScore = ConfidenceScore.create(randomScore);
      
      return {
        confidenceScore,
        status: new ProcessingStatusVO(ProcessingStatus.COMPLETE_SUCCESS),
      };
    } catch (error) {
      return {
        confidenceScore: ConfidenceScore.create(0),
        status: new ProcessingStatusVO(ProcessingStatus.COMPLETE_ERROR),
      };
    }
  }
}
