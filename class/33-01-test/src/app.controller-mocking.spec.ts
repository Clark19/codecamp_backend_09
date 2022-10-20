import { AppService } from './app.service';
import { AppController } from './app.controller';
import { Test, TestingModule } from '@nestjs/testing';

class MockAppService {
  // let mydatabase: string[] = ['board1', 'board2', 'board3'];

  getHello(): string {
    return '나는 가짜다!!!';
  }
}

describe('AppController 테스트 그룹', () => {
  /** 직접 DI 하는 방식
  let appService: AppService;
  let appController: AppController;

  beforeEach(() => {
    appService = new AppService();
    appController = new AppController(appService);
  });
  */

  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      // imports: [], // 있어도 되고 없어도 됨
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useClass: MockAppService, // AppService를 MockAppService로 대체
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  //
  describe('getTest 테스트그룹', () => {
    it('이 테스트의 검증 결과는 Hello World를 리턴해야 함!!!', () => {
      const result = appController.getHello();
      expect(result).toBe('Hello World!');
    });
  });

  // describe('fetchBoards Test', () => {
  //   appController.fetchBoards();
  // });

  // describe('createBoard Test', () => {
  //   appController.createBoard();
  // });
});
