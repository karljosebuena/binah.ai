import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    // Basic authorization header check
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid or missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');

    // TODO: Enhance security with:
    // 1. Proper JWT validation with clerk-sdk
    // 2. Token expiration check
    // 3. Role-based access control
    // 4. Rate limiting
    // 5. Request origin validation
    // 6. Audit logging for security events

    try {
      // For now, just validate token exists and set user info
      // In production, this should be replaced with proper token verification
      request.user = {
        id: 'mock-user-id', // This should come from verified token
        sessionId: 'mock-session-id' // This should come from verified token
      };

      return true;
    } catch (error) {
      console.error('Auth error:', error);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
