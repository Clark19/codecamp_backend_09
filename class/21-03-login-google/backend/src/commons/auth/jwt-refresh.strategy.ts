import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/** 'refresh' strategy
 *    :  GqlAuthAccessGuard 에서 'refresh' 이 이름으로 연동해서 사용
 */
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    // 검사하는 부분임. 실패시 리턴
    // {} : 검사하는 로직 작성
    super({
      jwtFromRequest: (req) => {
        // return req.cookies['access-token']; /* 쿠키에서 access-token을 가져오는 방식 */

        console.log(req);
        // 요청 헤더에서 refresh-token을 가져오는 방식
        const cookie = req.headers.cookie; // refreshToken=asdkljklklsdfjkjl
        const refreshToken = cookie.replace('refreshToken=', '');
        return refreshToken; // 이 엑세스 토큰이 'myAccessKey'로 만든게 맞는지, 만료됐는지 super()로 검사
      },
      // 위 코드를  passport에서 제공하므로 한줄로 대체 가능
      secretOrKey: 'myRefreshKey',
    });
  }

  validate(payload) {
    // 컨스트럭터의 검사 성공시 validate() 실행됨.
    console.log(payload); // { email: a@a.com, sub: sakjsd-kjdfjk }
    return {
      email: payload.email,
      id: payload.sub,
    }; // 리턴값이 req.user에 저장됨.
    // ex) req.user = { email: "a@a.com", id: "sakjsd-kjdfjk" }
  }
}
