import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { createClerkClient } from '@clerk/backend';

@Injectable()
export class AuthGuard implements CanActivate {
  private clerk: ReturnType<typeof createClerkClient>;

  constructor() {
    this.clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // TODO: Implement proper Clerk authentication
    // For testing purposes, always return true
    const request = context.switchToHttp().getRequest();
    request.user = {
      id: 'test-user-id',
      sessionId: 'test-session-id'
    };
    return true;
  }
}
