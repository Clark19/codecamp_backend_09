// // import { Inject, CACHE_MANAGER } from '@nestjs/common';
// import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
// import { BoardsService } from './boards.service';
// import { CreateBoardInput } from './dto/createBoard.input';
// import { Board } from './entities/board.entity';
// import { CACHE_MANAGER, Inject } from '@nestjs/common';

// @Resolver()
// export class BoardsResolver {
//   constructor(
//     private readonly boardsService: BoardsService, //

//     @Inject(CACHE_MANAGER)
//     private readonly cacheManager: Cache,
//   ) {}

//   // @Query(() => String, { nullable: true })
//   // getHello(): string {
//   //   return this.boardsService.getHello();
//   // }

//   // @Query(() => [Board]) // @nestjs/graphql 임포트해야 함. @nestjs/common 아님
//   @Query(() => String) // @nestjs/graphql 임포트해야 함. @nestjs/common 아님
//   fetchBoards() {
//     /// 레디스 연습용 임시 주석
//     // retuㄹrn this.boardsService.findAll();

//     const mycache = this.cacheManager.get('aaa');
//     console.log(mycache);

//     return '케시에서 조회 완료';
//   }

//   @Mutation(() => String)
//   createBoard(
//     // @Args('writer') writer: string,
//     // @Args('title') title: string,
//     // @Args('contents') contents: string,
//     // @Args('createBoardInput') createBoardInput: CreateBoardInput,
//     @Args({ name: 'createBoardInput', nullable: true })
//     createBoardInput: CreateBoardInput,
//   ) {
//     // 본 mysql 디비에 저장전 캐쉬(레디스)에 저장
//     this.cacheManager.set('aaa', createBoardInput, { ttl: 10 });

//     return '지금은 캐쉬(레디스) 테스트 중!!!';

//     // 레디스 연습을 위해서 잠시 주석 걸기!!!
//     // return this.boardsService.create({ createBoardInput });
//   }
// }

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BoardsService } from './boards.service';
import { Board } from './entities/board.entity';
import { CreateBoardInput } from './dto/createBoard.input';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';

@Resolver()
export class BoardsResolver {
  constructor(
    private readonly boardService: BoardsService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  // @Query(() => String)
  // getHello() {
  //   return this.boardService.aaa();
  // }

  // @Query(() => [Board])
  @Query(() => String)
  async fetchBoards() {
    // return this.boardService.findAll();

    /// 레디스 연습용 임시 주석
    // return this.boardsService.findAll();

    const mycache = await this.cacheManager.get('aaa');
    console.log(mycache);

    return '케시에서 조회 완료';
  }

  @Mutation(() => String)
  async createBoard(
    @Args({ name: 'writer', nullable: true }) writer: string,
    @Args('title') title: string,
    @Args('contents') contents: string,
    @Args('createBoardInput') createBoardInput: CreateBoardInput,
  ) {
    // 1. 캐시에 등록하는 연습
    await this.cacheManager.set('aaa', createBoardInput, {
      ttl: 0,
    });

    // 2. 캐시에서 조회하는 연습
    const mycache = await this.cacheManager.get('aaa');
    console.log(mycache);

    return '지금은 캐시 테스트 중!!!';
    ////////////////////////////////////////////////////////
    // 레디스 연습을 위해서 잠시 주석걸기!!
    // console.log(args);
    // console.log(writer);
    // console.log(title);
    // console.log(contents);
    // console.log(createBoardInput);
    // return this.boardService.create();
  }
}
