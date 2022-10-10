import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// class-validator 사용하기 위해 추가. 비슷한 import 경로가 많아서 실행시 에러나니 주의!
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './commons/filter/http-exception.filter';
import { graphqlUploadExpress } from 'graphql-upload';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // class-validator를 사용하기 위해 추가
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(graphqlUploadExpress()); // GQL 파일업로드하기위해. 16버전에 문제 있음 => 13.0.0 으로 설정
  await app.listen(3000);
}
bootstrap();
