import { Injectable } from '@nestjs/common';

@Injectable()
export class BoardsService {
  // getHello(): string {
  //   return 'Hello World!';
  // }

  findAll() {
    //1. 데이터 조회하는 로직 => DB에 접속해서 데이터 꺼내오기
    const result = [
      { number: 1, writer: 'name1(수정2)', title: '제목1', contents: '컨텐츠1' },
      { number: 2, writer: 'name2', title: 'title2', contents: 'content2' },
      { number: 3, writer: 'name3', title: 'title3', contents: 'content3' },
    ];

    console.log('gql boards end');

    // 2. db에서 꺼내온 결과를 브라우저에 응답(response) 주기
    return result;
  }

  create({ createBoardInput }) {
    // 1.클라이언트에서 보낸 데이터 확인
    console.log('gql posts ...');
    console.log(createBoardInput.writer);
    console.log(createBoardInput.title);
    console.log(createBoardInput.contents);

    // fetchBoards("철수")

    // 2. 데이터 등록하는 로직 => 디비에 접속해서 데이터 저장하기
    //

    // 3. 디비에 저장이 잘됐으면 결과를 클라이언트에 응답(response) 추가
    return '게시물 등록에 성공했습니다.';
  }
}
