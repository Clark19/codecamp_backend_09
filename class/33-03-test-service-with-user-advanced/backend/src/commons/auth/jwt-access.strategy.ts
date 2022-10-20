import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/** 'access' strategy
 *    :  GqlAuthAccessGuard 에서 'access' 이 이름으로 연동해서 사용
 */
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor() {
    // 검사하는 부분임. 실패시 리턴
    // {} : 검사하는 로직 작성
    super({
      // jwtFromRequest: (req) => {
      //   // return req.cookies['access-token']; /* 쿠키에서 access-token을 가져오는 방식 */

      //   console.log(req);
      //   // 요청 헤더에서 access-token을 가져오는 방식
      //   const temp = req.headers.authorization;
      //   const accessToken = temp.toLowerCase().replace('bearer ', '');
      //   return accessToken; // 이 엑세스 토큰이 'myAccessKey'로 만든게 맞는지, 만료됐는지 super()로 검사
      // },
      // 위 코드를 아래 passport에서 제공하므로 한줄로 대체 가능
      // 아래는 만료했는지, 조작했는지만 검증
      // 로그아웃 토큰은 아직 만료시간은 남아있으므로 validate로 넘어가므로 그상황이 문제
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // accessToken은 req header에 담겨 오므로 이렇게 가져옴
      secretOrKey: 'myAccessKey',
    });
  }

  validate(payload) {
    // 성공한 토큰에 대해서, 로그아웃된 토큰인지 레디스(블랙리스트)에서 확인하기
    // 레디스에 저장되있으면 return하지 말고 throw로 예외 던져야 함.

    // 컨스트럭터의 검사 성공시 validate() 실행됨.
    console.log(payload); // { email: a@a.com, sub: sakjsd-kjdfjk }
    return {
      email: payload.email,
      id: payload.sub,
    }; // 리턴값이 req.user에 저장됨.
    // ex) req.user = { email: "a@a.com", id: "sakjsd-kjdfjk" }
  }
}
