import { AppService } from './app.service';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  // appService;

  constructor(private readonly appService: AppService) {
    // this.appService = appService;
  }

  // @Get('/products/buy')
  // buyProduct(): string {
  //   return this.appService.getHello();
  // }

  @MessagePattern({ cmdName: '로그인실행해줘' })
  login222(data) {
    // 실제 로그인 하기
    console.log(data);
    return 'login 성공';
  }

  logout() {
    //
  }

  restoreAccessToken() {
    //
  }
}
