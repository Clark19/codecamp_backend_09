import { Injectable } from '@nestjs/common';

@Injectable()
export class StarbucksService {
  findAll() {
    //1. 데이터 조회하는 로직 => DB에 접속해서 데이터 꺼내오기
    const result = [
      {
        number: 1,
        menu: '아메리카노',
        price: 4500,
        kcal: 5,
        saturated_fat: 0,
        protein: 0,
        salt: 0,
        sugar: 0,
        caffeine: 75,
      },
      {
        number: 2,
        menu: '카페라떼',
        price: 5000,
        kcal: 110,
        saturated_fat: 4,
        protein: 6,
        salt: 70,
        sugar: 8,
        caffeine: 75,
      },
      {
        number: 3,
        menu: '나이트로 바닐라 크림',
        price: 3000,
        kcal: 3,
        saturated_fat: 3,
        protein: 3,
        salt: 3,
        sugar: 3,
        caffeine: 3,
      },
      {
        number: 4,
        menu: '바닐라 크림 콜드 브루',
        price: 4000,
        kcal: 4,
        saturated_fat: 4,
        protein: 4,
        salt: 4,
        sugar: 4,
        caffeine: 4,
      },
      {
        number: 5,
        menu: '벨벳 다크 모카 나이트로',
        price: 5000,
        kcal: 5,
        saturated_fat: 5,
        protein: 5,
        salt: 5,
        sugar: 5,
        caffeine: 5,
      },
    ];

    console.log('gql boards end');

    // 2. db에서 꺼내온 결과를 브라우저에 응답(response) 주기
    return result;
  }

  create({ createStarbucksInput }) {
    // 1.클라이언트에서 보낸 데이터 확인
    console.log('gql posts ...');
    console.log('createStarbucksInput:', createStarbucksInput);

    // 2. 데이터 등록하는 로직 => 디비에 접속해서 데이터 저장하기

    // 3. 디비에 저장이 잘됐으면 결과를 클라이언트에 응답(response) 추가
    return '등록에 성공하였습니다.';
  }
}
