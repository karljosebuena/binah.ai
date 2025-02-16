import { Sample } from '../../domain/entities/sample.entity';

export interface ISampleRepository {
  save(sample: Sample): Promise<Sample>;
  findById(id: string): Promise<Sample | null>;
  findByUserId(userId: string): Promise<Sample[]>;
  delete(id: string): Promise<void>;
}
