import {
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';

// 나만의 미니 TypeORM 만들기
class MockUsersRepository {
  mydb = [
    { email: 'a@a.com', password: '0000', name: '짱구', age: 8 },
    { email: 'qqq@qqq.com', password: '1234', name: '철수', age: 12 },
  ];

  findOne({ where }) {
    const users = this.mydb.filter((el) => el.email === where.email);
    if (users.length) return users[0];
    return null;
  }

  save({ email, password, name, age }) {
    this.mydb.push({ email, password, name, age });
    return { email, password, name, age };
  }
}

// !! 생소하고 중요!
// union 타입 키 각각에다가 Jest.Mock 객체를 밸류로 할당.
// Repository<User>의 가짜 타입을 만들어 줌.
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: MockRepository<User>;

  beforeEach(async () => {
    const usersModule: TestingModule = await Test.createTestingModule({
      // imports: [TypeOrmModule.forFeature([User])], // 이렇게 하면 진짜 DB에 접근하게 된다.
      // controllers: [], // 서비스 로직쪽 테스트라 컨트롤러/리졸버는 필요없음
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: MockUsersRepository,
        },
      ],
    }).compile();

    usersService = usersModule.get<UsersService>(UsersService);
    usersRepository = usersModule.get<MockRepository>(getRepositoryToken(User));
  });

  // describe('findOne', () => {
  //   const result = usersService.findOne({ email: '이메일주소' });
  //   expect(result).toBe('결과');
  // });

  describe('create', () => {
    it('이미 존재하는 이메일 검증하기', async () => {
      const usersRepositorySpyFindOne = jest.spyOn(usersRepository, 'findOne');
      const usersRepositorySpySave = jest.spyOn(usersRepository, 'save');

      const myData = {
        email: 'a@a.com',
        hashedPassword: '1234',
        name: '철수',
        age: 13,
      };

      try {
        await usersService.create({ ...myData });
      } catch (error) {
        // expect(error.message).toBe('이미 등록된 이메일입니다.');
        expect(error).toBeInstanceOf(ConflictException);
      }

      expect(usersRepositorySpyFindOne).toBeCalledTimes(1); // 호출횟수까지 비교해서 조금 더 정밀하게 테스트하기 위해
      expect(usersRepositorySpySave).toBeCalledTimes(0);
    });

    it('회원 등록 잘 됐는지 검증하기', async () => {
      const usersRepositorySpyFindOne = jest.spyOn(usersRepository, 'findOne');
      const usersRepositorySpySave = jest.spyOn(usersRepository, 'save');

      const myData = {
        email: 'bbb@bbb.com',
        hashedPassword: '1234',
        name: '철수',
        age: 13,
      };

      const result = await usersService.create({ ...myData });
      // expect(result).toStrictEqual({
      //   email: myData.email,
      //   password: myData.hashedPassword,
      //   name: myData.name,
      //   age: myData.age,
      // });
      expect(result).toStrictEqual({
        email: 'bbb@bbb.com',
        password: '1234',
        name: '철수',
        age: 13,
      });

      expect(usersRepositorySpyFindOne).toBeCalledTimes(1); // 호출횟수까지 비교해서 조금 더 정밀하게 테스트하기 위해
      expect(usersRepositorySpySave).toBeCalledTimes(1);
    });

    // TDD 방식 : 테스트 먼저 만들고 기능 구현
    it('이메일 길이가 초과 했을때 검증', () => {
      const myData = {
        email: 'asdf@a.com',
      };

      try {
        // await usersService.create({ ...myData });
      } catch (error) {
        expect(error).toBeInstanceOf(UnprocessableEntityException);
      }
    });
  });
});
