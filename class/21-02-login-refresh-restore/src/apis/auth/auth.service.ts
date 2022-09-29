import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, //
  ) {}

  /** Response Header부분에 리프레쉬토큰을 쿠키에 담아 넘겨줌 */
  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: 'myRefreshKey', expiresIn: '2w' },
    );

    // 개발환경
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}`); // 쿠키에 refreshToken을 담아서 response header에 넣어주기만 하면 됨. 다른 곳에서 알아서 response 리턴 하므로

    // 배포환경
    // res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/; domain=.mybacksite.com; SameSite=None; Secure; httpOnly;`)
    // res.setHeader('Access-Control-Allow-Origin', 'https://myfrontsite.com')
    // SameSite=None;은 어떤 의미인가?
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
  }

  getAccessToken({ user }) {
    // header.payload.signature
    return this.jwtService.sign(
      { email: user.email, sub: user.id },
      // { secret: 'myAccessKey', expiresIn: '1h' },
      { secret: 'myAccessKey', expiresIn: '15s' },
    );
  }
}
