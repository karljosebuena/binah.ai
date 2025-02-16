import { TestResult } from '../../domain/entities/test-result.entity';
import { TestType } from '../../domain/value-objects/test-type.vo';

export interface ITestResultRepository {
  save(result: TestResult): Promise<TestResult>;
  findById(id: string): Promise<TestResult | null>;
  findByUserId(userId: string): Promise<TestResult[]>;
  findByUserIdAndTestType(userId: string, testType: TestType): Promise<TestResult[]>;
  update(id: string, result: Partial<TestResult>): Promise<TestResult>;
  delete(id: string): Promise<void>;
}
