import { AppService } from './app.service';
import { AppController } from './app.controller';

describe('AppController 테스트 그룹', () => {
  let appService: AppService;
  let appController: AppController;

  beforeEach(() => {
    appService = new AppService();
    appController = new AppController(appService);
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
