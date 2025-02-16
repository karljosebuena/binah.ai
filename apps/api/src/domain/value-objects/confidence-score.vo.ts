export class ConfidenceScore {
  private constructor(private readonly value: number) {
    this.validate(value);
  }

  static create(value: number): ConfidenceScore {
    return new ConfidenceScore(value);
  }

  getValue(): number {
    return this.value;
  }

  getInterpretation(): 'LOW' | 'HIGH' | 'INCONCLUSIVE' {
    if (this.value < 0.5) return 'LOW';
    if (this.value > 0.5) return 'HIGH';
    return 'INCONCLUSIVE';
  }

  private validate(value: number): void {
    if (value < 0 || value > 1) {
      throw new Error('Confidence score must be between 0 and 1');
    }
  }
}
