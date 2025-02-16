export enum TestType {
  TB = 'TB',
  COVID19 = 'COVID19',
  SMOKING = 'SMOKING',
}

export class TestTypeVO {
  constructor(private readonly value: TestType) {}

  getValue(): TestType {
    return this.value;
  }

  static isValid(type: string): boolean {
    return Object.values(TestType).includes(type as TestType);
  }
}
