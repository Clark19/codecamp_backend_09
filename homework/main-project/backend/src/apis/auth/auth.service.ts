import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { IContext } from 'src/commons/types/context';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, //

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /** Response Header부분에 리프레쉬토큰을 쿠키에 담아 넘겨줌 */
  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.REFRESH_KEY, expiresIn: '2w' },
    );

    // 개발환경, 만약 소셜로그인 하려면  path=/;`이것도 넣어줘야함
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`); // 쿠키에 refreshToken을 담아서 response header에 넣어주기만 하면 됨. 다른 곳에서 알아서 response 리턴 하므로

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
      { secret: process.env.ACCESS_KEY, expiresIn: '1h' },
      // { secret: process.env.ACCESS_KEY, expiresIn: '20s' },
    );
  }

  verifyToken(accToken, refreshToken) {
    let decodedAccToken = null;
    let decodedRefreshToken = null;
    try {
      decodedAccToken = jwt.verify(accToken, process.env.ACCESS_KEY);
      decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_KEY);
      console.log(
        `decodedAccToken: ${decodedAccToken.exp}, \n decodedRefreshToken: ${decodedRefreshToken.exp}`,
      );
    } catch (err) {
      console.log('Error!!!');
      throw new UnauthorizedException(`
          errName: ${err.name}
          message: ${err.message}
          expiredAt: ${err.expiredAt}
        `);
    }
    return { decodedAccToken, decodedRefreshToken };
  }

  async logout({ req, res }) {
    const accToken = req.headers['authorization'].replace('Bearer ', '');
    const refreshToken = req.headers['cookie'].replace('refreshToken=', '');
    // console.log(`accToken: ${accToken}, \n refreshToken: ${refreshToken}`);

    const { decodedAccToken, decodedRefreshToken } = this.verifyToken(
      accToken,
      refreshToken,
    );

    // 1. 캐시에 등록하는 연습
    await this.cacheManager.set('accessToken', accToken, {
      ttl: 0,
    });

    let expireTTL = decodedAccToken.exp; // 나중에 계산해서 수정
    await this.cacheManager.set(`accessToken:${accToken}`, accToken, {
      ttl: expireTTL,
    });
    expireTTL = decodedRefreshToken.exp;
    await this.cacheManager.set(`refreshToken:${refreshToken}`, refreshToken, {
      ttl: expireTTL,
    });

    // 2. 캐시에서 조회하는 연습
    const mycache = await this.cacheManager.get(`accessToken:${accToken}`);
    const mycache2 = await this.cacheManager.get(
      `refreshToken:${refreshToken}`,
    );
    console.log('mycache accessToken:', mycache);
    console.log('mycache2 refreshToken:', mycache2);

    // 개발환경, 만약 소셜로그인 하려면  path=/;`이것도 넣어줘야함
    res.setHeader('Set-Cookie', `refreshToken=; path=/;`); // 쿠키에 refreshToken을 담아서 response header에 넣어주기만 하면 됨. 다른 곳에서 알아서 response 리턴 하므로

    return '로그아웃에 성공했습니다.';
  }
}
