import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Product } from './product.entity';
import { BigQuery } from '@google-cloud/bigquery';

@EventSubscriber()
export class ProductSubscriber implements EntitySubscriberInterface {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this); // 구독자들을 등록해야 함.
  }

  listenTo() {
    return Product;
  }

  afterInsert(event: InsertEvent<any>): void | Promise<void> {
    console.log('event', event); // product 데이터 삽입되면 그 데이터들이 이벤트로 들어옴
    // 예) event.entity.price, event.entity.isSoldOut 등

    // <로그를 저장하는 방법 4가지>
    // 1방식. 여기서 발생한 로그를, 서버 컴퓨터 파일로(.txt등) 저장하기 => 시간별이나 일자별 로그 로테이션(분리해서 저장). 로그 파일을 저장하는 라이브러리 사용하기도 하는 듯?
    // 작은 서비스 일때(트래픽 적을때 등)

    // 2방식. DB에 로그테이블 만들고 저장하기. MyLog 테이블 만들어서 넣기할수 있는데,
    //   로그데이터가 많아지는데 DB에 부하가 많이 가거가, 샤딩이나 파티셔닝(HA 하이어빌리티) 등을 해야하는 관리적인 부담이 있음.

    // (3방식. 로그 서버 만들어서 로그 저장하기)

    // 4방식. 외부빅데이터(BigQuery) 관련 DB에 로그테이블 만들고 저장하기
    // 막 저장하고 검색도 빠르고 잘못되도 메인 디비에 영향도 없고 비교적 관리도 쉽다고 함.
    const bigquery = new BigQuery({
      keyFilename: 'gcp-file-storage.json', //'gcp-bigquery.json',
      projectId: 'backend-364006',
    });

    bigquery
      .dataset('mybigquery09')
      .table('productlog')
      .insert([
        {
          id: event.entity.id,
          name: event.entity.name,
          description: event.entity.description,
          price: event.entity.price,
          isSoldout: event.entity.isSoldout,
        },
      ]);

    // ===============================
    // 트리거는 언제 사용하면 안될까?
    // 트랜잭션 연결된 중요한 내용들 ...
    //     dB 트랜잭션을 나눠서 처리하는데 사용하지 말아야 한다. ls
    // 예를 들어 결제 데이터 삽입되면 포인트 충전 데이터가 트리거 되서 삽입되는 식은 하지 말것!

    // 트리거는 언제 사용하면 좋을까?
    // 메인 로직에 큰 피해를 안끼치는 로직들...(통계 계산, 로그 쌓아놓기 등)
    // 사용 가능 예) 로그.
    // 결제 테이블에 결제 데이터 삽입되면, 트리거로 결제완료 메일 보내기 등
    // 유저 한명 들어갈때 마다 몇명인지 count 하는거에 사용 가능
    //   통계/집계용 테이블 만들어(Summary_user) count컬럼의 값을 200(명)에서 201(명)로 바꾸는거에 사용 가능
  }
}
