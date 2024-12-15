/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler()); // Fetch allowed roles
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1]; // Extract token

    // If no token, deny access
    if (!token) {
      console.error('No token found in the request.');
      throw new ForbiddenException('Token is required for access.');
    }

    try {
      // Verify the token and decode user data
      const decoded = this.jwtService.verify(token);
      console.log('Decoded Token:', decoded);

      // Attach the decoded user to the request for further usage
      request.user = decoded;

      // If roles are specified (e.g., 'admin'), check against decoded role
      if (roles && !roles.includes(decoded.role)) {
        console.warn('Role mismatch:', { requiredRoles: roles, userRole: decoded.role });
        throw new ForbiddenException(`Access denied: You need one of the following roles: ${roles.join(', ')}`);
      }

      return true; // Grant access
    } catch (error) {
      // Improved error handling for debugging
      if (error instanceof Error) {
        console.error('AuthGuard Error:', error.message);
      } else {
        console.error('AuthGuard Error:', error);
      }
      throw new ForbiddenException('Invalid or expired token.');
    }
  }
}
