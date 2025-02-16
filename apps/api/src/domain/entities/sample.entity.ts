import { TestType } from '../value-objects/test-type.vo';

export class Sample {
  constructor(
    private readonly id: string,
    private readonly userId: string,
    private readonly filePath: string,
    private readonly testTypes: TestType[],
    private readonly coughCount: number,
    private readonly createdAt: Date,
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.coughCount < 6) {
      throw new Error('Sample must contain at least 6 coughs');
    }
    if (this.testTypes.length === 0) {
      throw new Error('At least one test type must be selected');
    }
  }

  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getFilePath(): string {
    return this.filePath;
  }

  getTestTypes(): TestType[] {
    return [...this.testTypes];
  }

  getCoughCount(): number {
    return this.coughCount;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}
