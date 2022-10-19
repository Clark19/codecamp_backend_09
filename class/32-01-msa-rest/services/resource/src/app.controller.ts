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

  @MessagePattern({ cmd: 'fetchBoards' })
  fetchBoards() {
    // 실제 데이터 조회하기
    return '게시글 데이터 보내주기';
  }
}
