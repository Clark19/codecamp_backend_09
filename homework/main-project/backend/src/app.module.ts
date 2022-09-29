import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsModule } from './apis/boards/boards.module';
// import { Board } from './apis/boards/entities/board.entity';
import { ConfigModule } from '@nestjs/config';
import GraphQLJSON from 'graphql-type-json';
import { YoutubeInfosModule } from './apis/youtubeInfo/youtubeInfos.module';
import { UsersModule } from './apis/users/users.module';
import { AuthModule } from './apis/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    BoardsModule,
    YoutubeInfosModule,
    UsersModule,
    ConfigModule.forRoot(), // .env 파일을 읽어서 process.env 에 넣는거 가능하게 하므로 TypeOrmModule.forRoot 보다 윗줄에 있어야 함
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql', // 이거 입력하지 않으면 스키마 퍼스트임. 그리고 해당 폴더에 해당 파일을 생성해 줌.
      // resolvers: { JSON: GraphQLJSON },
      context: ({ req, res }) => ({ req, res }), // nestjs의 req, res 를 graphql의 api에서 사용할 수 있게 해줌.  nestjs에서 graphql을 사용할 때, context를 사용할 수 있게 해줌,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      // entities: [Board, Product, ProductTag, ProductSaleslocation], // 하나하나 열거법. 이렇게 하면 모든 엔티티를 다 적어줘야 함. 귀찮으니까 아래처럼 glob 패턴을 사용함.
      // entities: [__dirname + '/apis/**/*.entity{.ts,.js}'], // .ts만 적으면 실행 안된다고 함.
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true, // 이거 해야 소스코드랑 연동해 테이블 만들어줌. 따라서 개발할 때만 true로 해놓고, 배포할 때는 false로 해놓는다.
      logging: true, // typeorm이 생성해주는 쿼리를 보고 싶으면 true로 설정
    }),
  ],
})
export class AppModule {}
