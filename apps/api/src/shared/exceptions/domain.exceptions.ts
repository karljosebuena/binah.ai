export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
  }
}

export class InvalidSampleException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidSampleException';
  }
}

export class InvalidTestTypeException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidTestTypeException';
  }
}

export class ProcessingException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'ProcessingException';
  }
}

export class StorageException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'StorageException';
  }
}
