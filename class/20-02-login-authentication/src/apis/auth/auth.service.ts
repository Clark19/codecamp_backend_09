import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { userInfo } from 'os';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, //
  ) {}

  getAccessToken({ user }) {
    // header.payload.signature
    return this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: 'myAccesKey', expiresIn: '1h' },
    );
  }
}
