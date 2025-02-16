export interface IFCVValidator {
  validateCoughCount(count: number): boolean;
  validateFileFormat(filePath: string): Promise<boolean>;
  validateTestTypes(testTypes: string[]): boolean;
}
