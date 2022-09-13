// swagger-jsdoc 용 옵션
export const options = {
  failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
  definition: {
    openapi: "3.0.0",
    info: {
      title: "나만의 미니 프로젝트 API 명세서",
      version: "1.0.0",
    },
  },
  apis: ["./src/swagger/*.swagger.js"], // 내가 따로 관리할 파일의 경로 입력하면 됨
};

// const openapiSpecification = swaggerJsdoc(options);
