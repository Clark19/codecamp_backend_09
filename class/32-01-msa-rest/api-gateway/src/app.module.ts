import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP, // Transport.GRPC 는 2진 데이터라서 더 빠르다. 가능하면 짧은 경로로 구성해라. 예) nginx 다음 api GateWay 등으로 여러단계 두면 트래픽이 느려질수 있따. , 분산 트랜잭션 사바 패턴
        options: { host: 'auth-service', port: 3001 },
      },
      {
        name: 'RESOURCE_SERVICE',
        transport: Transport.TCP,
        options: { host: 'resource-service', port: 3002 },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
