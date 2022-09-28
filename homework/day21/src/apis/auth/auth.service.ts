import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, //
  ) {}

  getAccessToken({ user }) {
    // header.payload.signature
    return this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.ACCESS_KEY, expiresIn: '1h' },
    );
  }
}
