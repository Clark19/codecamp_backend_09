// swagger-jsdoc 용 옵션 설정
export const options = {
    failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Day04 회원 목록, 커피 메뉴 목록 조회 API 명세',
        version: '1.0.0',
      },
    },
    apis: ['./swagger/*.swagger.js'],
  };
  
