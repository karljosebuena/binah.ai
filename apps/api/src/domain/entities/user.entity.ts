export class User {
  constructor(
    private readonly id: string,
    private readonly email: string,
    private readonly firstName: string,
    private readonly lastName: string,
    private readonly createdAt: Date,
  ) {
    this.validateEmail(email);
  }

  getId(): string {
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }

  getFirstName(): string {
    return this.firstName;
  }

  getLastName(): string {
    return this.lastName;
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }
}
