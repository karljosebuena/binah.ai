import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { TestResultService } from '../../../application/services/test-result.service';
import { TestResultDto } from '../../../application/dtos/test-result.dto';
import { TestType } from '../../../domain/value-objects/test-type.vo';
import { AuthGuard } from '../../../infrastructure/auth/auth.guard';

@Controller({
  path: 'test-results',
  version: '1'
})
@UseGuards(AuthGuard)
export class TestResultController {
  constructor(
    private readonly testResultService: TestResultService,
  ) {}

  @Get()
  async getResults(
    @Query('userId') userId: string,
    @Query('testType') testType?: TestType,
  ): Promise<TestResultDto[]> {
    if (testType) {
      return this.testResultService.getUserResultsByType(userId, testType);
    }
    return this.testResultService.getUserResults(userId);
  }
}
