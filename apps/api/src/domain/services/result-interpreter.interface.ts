import { ConfidenceScore } from '../value-objects/confidence-score.vo';
import { TestType } from '../value-objects/test-type.vo';

export interface IResultInterpreter {
  interpretResult(
    testType: TestType,
    confidenceScore: ConfidenceScore,
  ): {
    interpretation: string;
    recommendation: string;
  };
}
