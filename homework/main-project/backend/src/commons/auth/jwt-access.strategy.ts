import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';

/** 'access' strategy
 *    :  GqlAuthAccessGuard 에서 'access' 이 이름으로 연동해서 사용
 */
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
    // 검사하는 부분임. 실패시 리턴
    // {} : 검사하는 로직 작성
    super({
      // jwtFromRequest: (req) => {
      //   // return req.cookies['access-token']; /* 쿠키에서 access-token을 가져오는 방식 */

      //   console.log(req);
      //   // 요청 헤더에서 access-token을 가져오는 방식
      //   const temp = req.headers.authorization;
      //   const accessToken = temp.toLowerCase().replace('Bearer ', '');
      //   return accessToken; // 이 엑세스 토큰이 'myAccessKey'로 만든게 맞는지, 만료됐는지 super()로 검사
      // },
      // 위 코드를 아래 passport에서 제공하므로 한줄로 대체 가능
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // accessToken은 req header에 담겨 오므로 이렇게 가져옴
      secretOrKey: process.env.ACCESS_KEY, // AuthService 내 jwtService.sign()의 secret과 같아야 함.
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    // constructor(){...} 내부로직에서 검사 성공시 validate() 실행됨.
    // console.log('in JwtAccessStrategy:', payload); // { email: a@a.com, sub: sakjsd-kjdfjk }. uuid가 sub에 들어있음
    const token = req.headers.authorization.replace('Bearer ', '');
    const isToken = await this.cacheManager.get(`accessToken:${token}`);

    if (isToken) throw new UnauthorizedException('레디스 블랙리스트');

    return {
      email: payload.email,
      id: payload.sub,
    }; // 리턴값이 req.user에 저장됨.
    // ex) req.user = { email: "a@a.com", id: "sakjsd-kjdfjk" }. uuid가 sub에 들어있음
  }
}
