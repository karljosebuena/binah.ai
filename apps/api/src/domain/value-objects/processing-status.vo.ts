export enum ProcessingStatus {
  INCOMPLETE = 'INCOMPLETE',
  COMPLETE_SUCCESS = 'COMPLETE_SUCCESS',
  COMPLETE_ERROR = 'COMPLETE_ERROR',
  COMPLETE_FAILURE = 'COMPLETE_FAILURE',
}

export class ProcessingStatusVO {
  constructor(private readonly value: ProcessingStatus) {}

  getValue(): ProcessingStatus {
    return this.value;
  }

  isComplete(): boolean {
    return this.value !== ProcessingStatus.INCOMPLETE;
  }

  isSuccess(): boolean {
    return this.value === ProcessingStatus.COMPLETE_SUCCESS;
  }
}
