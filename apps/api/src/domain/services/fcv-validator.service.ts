import { IFCVValidator } from './fcv-validator.interface';
import { TestType, TestTypeVO } from '../value-objects/test-type.vo';

export class FCVValidatorService implements IFCVValidator {
  validateCoughCount(count: number): boolean {
    return count >= 6;
  }

  async validateFileFormat(filePath: string): Promise<boolean> {
    // In a real implementation, we would:
    // 1. Check file extension (e.g., .wav, .mp3)
    // 2. Verify file integrity
    // 3. Check file size limits
    // 4. Validate audio format specifications
    
    const validExtensions = ['.wav', '.mp3'];
    const extension = filePath.toLowerCase().slice(filePath.lastIndexOf('.'));
    return validExtensions.includes(extension);
  }

  validateTestTypes(testTypes: string[]): boolean {
    if (testTypes.length === 0) return false;
    return testTypes.every(type => TestTypeVO.isValid(type));
  }
}
