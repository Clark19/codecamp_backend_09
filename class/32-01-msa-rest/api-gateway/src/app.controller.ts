import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
// import { AppService } from './app.service';

@Controller()
export class AppController {
  // appService;

  constructor(
    // private readonly appService

    @Inject('AUTH_SERVICE')
    private readonly clientAuthService: ClientProxy,

    @Inject('RESOURCE_SERVICE')
    private readonly clientResourceService: ClientProxy,
  ) {
    // this.appService = appService;
  }

  // @Get('/products/buy')
  // buyProduct(): string {
  //   return this.appService.getHello();
  // }

  @Get('/auth/login')
  login() {
    // auth-service로 트래픽 넘겨줌
    return this.clientAuthService.send(
      { cmdName: '로그인실행해줘' },
      { email: 'a@a.com', password: '1234' },
    );
  }

  @Get('/boards')
  fetchBoards() {
    // resource-service로 트래픽 전달
    return this.clientResourceService.send({ cmd: 'fetchBoards' }, {});
  }
}
