/** GCP 쿠버네티스의 인그레스(로드밸런서&Https 역할) 의 헬스 체크용. gcp tcp 80 버그 있어서 안되서 만듦 */
import { Get, Controller } from "@nestjs/common"

@Controller()
export class AppController {
  
  @Get("/")
  qqq() {
    return "안녕하세요 33"
  }
}
