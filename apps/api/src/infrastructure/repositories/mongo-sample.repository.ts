import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { ISampleRepository } from '../../application/interfaces/sample.repository.interface';
import { Sample } from '../../domain/entities/sample.entity';
import { SampleDocument } from '../database/schemas/sample.schema';

@Injectable()
export class MongoSampleRepository implements ISampleRepository {
  constructor(
    @InjectModel('Sample')
    private readonly sampleModel: Model<SampleDocument>,
  ) {}

  async save(sample: Sample): Promise<Sample> {
    const created = new this.sampleModel({
      userId: sample.getUserId().replace(/"/g, ''), // Remove any extra quotes
      filePath: sample.getFilePath(),
      testTypes: sample.getTestTypes(),
      coughCount: sample.getCoughCount(),
    });
    await created.save();
    return sample;
  }

  async findById(id: string): Promise<Sample | null> {
    const doc = await this.sampleModel.findById(id).exec();
    if (!doc) return null;
    
    return new Sample(
      doc._id?.toString() || '',
      doc.userId,
      doc.filePath,
      doc.testTypes,
      doc.coughCount,
      doc.createdAt || new Date(),
    );
  }

  async findByUserId(userId: string): Promise<Sample[]> {
    const docs = await this.sampleModel.find({ userId }).exec();
    return docs.map(doc => 
      new Sample(
        doc._id?.toString() || crypto.randomUUID(),
        doc.userId,
        doc.filePath,
        doc.testTypes,
        doc.coughCount,
        doc.createdAt || new Date(),
      )
    );
  }

  async delete(id: string): Promise<void> {
    await this.sampleModel.findByIdAndDelete(id).exec();
  }
}
