import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProcessingStatus } from '../../domain/value-objects/processing-status.vo';
import { ITestResultRepository } from '../../application/interfaces/test-result.repository.interface';
import { TestResult } from '../../domain/entities/test-result.entity';
import { TestResultDocument } from '../database/schemas/test-result.schema';
import { TestType } from '../../domain/value-objects/test-type.vo';
import { ConfidenceScore } from '../../domain/value-objects/confidence-score.vo';
import { ProcessingStatusVO } from '../../domain/value-objects/processing-status.vo';

@Injectable()
export class MongoTestResultRepository implements ITestResultRepository {
  constructor(
    @InjectModel('TestResult')
    private readonly testResultModel: Model<TestResultDocument>,
  ) {}

  async save(result: TestResult): Promise<TestResult> {
    console.log('Saving test result:', {
      sampleId: result.getSampleId(),
      userId: result.getUserId(),
      testType: result.getTestType(),
      confidenceScore: result.getConfidenceScore().getValue(),
      processingStatus: result.getProcessingStatus().getValue(),
    });

    const created = new this.testResultModel({
      sampleId: result.getSampleId(),
      userId: result.getUserId(),
      testType: result.getTestType(),
      confidenceScore: result.getConfidenceScore().getValue(),
      processingStatus: result.getProcessingStatus().getValue(),
    });

    const saved = await created.save();
    console.log('Saved document:', saved);
    return result;
  }

  async findById(id: string): Promise<TestResult | null> {
    const doc = await this.testResultModel.findById(id).exec();
    if (!doc) return null;

    return this.mapToEntity(doc);
  }

  async findByUserId(userId: string): Promise<TestResult[]> {
    console.log('Repository: Finding results for user:', userId);
    const docs = await this.testResultModel.find({ userId }).exec();
    console.log('Repository: Found documents:', docs);
    return docs.map(doc => this.mapToEntity(doc));
  }

  async findByUserIdAndTestType(userId: string, testType: TestType): Promise<TestResult[]> {
    const docs = await this.testResultModel.find({ userId, testType }).exec();
    return docs.map(doc => this.mapToEntity(doc));
  }

  async update(id: string, result: Partial<TestResult>): Promise<TestResult> {
    const updated = await this.testResultModel
      .findByIdAndUpdate(
        id,
        {
          confidenceScore: result.getConfidenceScore?.()?.getValue() || 0,
          processingStatus: result.getProcessingStatus?.()?.getValue() || ProcessingStatus.COMPLETE_ERROR,
        },
        { new: true }
      )
      .exec();

    if (!updated) {
      throw new Error('Test result not found');
    }

    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.testResultModel.findByIdAndDelete(id).exec();
  }

  private mapToEntity(doc: TestResultDocument): TestResult {
    return new TestResult(
      doc._id?.toString() || '',
      doc.sampleId,
      doc.userId,
      doc.testType,
      ConfidenceScore.create(doc.confidenceScore),
      new ProcessingStatusVO(doc.processingStatus),
      doc.createdAt || new Date(),
      doc.updatedAt || new Date(),
    );
  }
}
