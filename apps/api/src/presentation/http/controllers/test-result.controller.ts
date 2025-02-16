import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { TestResultService } from '../../../application/services/test-result.service';
import { TestResultDto } from '../../../application/dtos/test-result.dto';
import { TestType } from '../../../domain/value-objects/test-type.vo';
import { AuthGuard } from '../../../infrastructure/auth/auth.guard';

@ApiTags('Test Results')
@ApiBearerAuth()
@Controller({
  path: 'test-results',
  version: '1'
})
@UseGuards(AuthGuard)
export class TestResultController {
  constructor(
    private readonly testResultService: TestResultService,
  ) {}

  @ApiOperation({ summary: 'Get test results for a user' })
  @ApiQuery({ name: 'userId', required: true, description: 'ID of the user to get results for' })
  @ApiQuery({ 
    name: 'testType', 
    required: false, 
    enum: TestType,
    description: 'Optional filter for specific test type' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of test results',
    type: [TestResultDto]
  })
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
