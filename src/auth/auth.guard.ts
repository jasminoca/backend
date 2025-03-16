/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the required roles for the route (if any)
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    
    // Extract the request object
    const request = context.switchToHttp().getRequest();
    
    // Get token from Authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Missing or invalid Authorization header.');
      throw new UnauthorizedException('Authentication token is required.');
    }

    const token = authHeader.split(' ')[1]; // Extract token

    try {
      // Verify the JWT token
      const decoded = this.jwtService.verify(token);
      console.log('Decoded Token:', decoded);

      // Attach the decoded user to the request for further processing
      request.user = decoded;

      // If roles are specified, check if the user has the required role
      if (roles && !roles.includes(decoded.role)) {
        console.warn('Role mismatch:', { requiredRoles: roles, userRole: decoded.role });
        throw new ForbiddenException(`Access denied: Requires one of the roles: ${roles.join(', ')}`);
      }

      return true; // Allow access if everything is valid
    } 
      catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
          console.error('AuthGuard Error:', errorMessage);
      throw new UnauthorizedException('Invalid or expired authentication token.');
    }    
  }
}
