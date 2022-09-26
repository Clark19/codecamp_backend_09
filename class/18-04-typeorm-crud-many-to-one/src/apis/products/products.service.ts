import {
  HttpException,
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductSaleslocation } from '../productsSaleslocations/entities/productSaleslocation.entity';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    @InjectRepository(ProductSaleslocation)
    private readonly productsSaleslocationRepository: Repository<ProductSaleslocation>,
  ) {}

  // async findAll() {
  //   return await this.productsRepository.find();
  // }

  async findAll() {
    // const result = await this.productsRepository.find();
    // const result = await this.productsRepository.find({
    //   where: { isDeleted: false },
    // });
    const result = await this.productsRepository.find({
      relations: ['productSaleslocation', 'productCategory'], // 조회(fetch)시엔 등록한 테이블 조인해서 리턴하므로 create시와 다르게 카테고리 name 컬럼값들을 원하는대로 받을수있다.
    });

    // 추가 작업 2 코딩 할땐 위처럼 async, await 써야 함.
    // 그냥 아래처럼 리턴 할거면 async, await 안써도 됨
    // return await this.productsRepository.find();

    return result;
  }

  findOne({ productId }) {
    return this.productsRepository.findOne({
      where: { id: productId },
      relations: ['productSaleslocation', 'productCategory'],
    });
  }

  async create({ createProductInput }) {
    // 1방식. 상품만 등록하는 경우
    // const result = this.productsRepository.save({
    //   ...createProductInput,

    // // 하나하나 직접 나열하는 방식
    // name: '마우스',
    // description: '좋은 마우스',
    // price: 3000,
    // productSaleslocationId: "aaa-ddkfjkf"
    // });

    // 2방식. 상품과 상품거래위치를 같이 등록하는 경우
    const { productSaleslocation, productCategoryId, ...product } =
      createProductInput;
    // console.log('createProductInput: ', createProductInput);
    // console.log('productSaleslocation: ', productSaleslocation);
    // console.log('product: ', product);

    // 상품판매위치 먼저 등록
    const result = await this.productsSaleslocationRepository.save({
      ...productSaleslocation, // 구조분해 할당 사용함으로써 나열 불필요.
      // address: productSaleslocation.address, // 이렇게 하나하나 직접 나열하는 방식
      // ...
    });
    // console.log('result1: ', result);

    // 2. 상품 등록시에
    const result2 = await this.productsRepository.save({
      ...product,
      productCategory: {
        // 현재는 카테고리 id만 프론트에 리턴할 수 있음. 카테고리 명도 같이 리턴하려면
        // 이거 전에 카테고리 조회해서 리턴시 카테고리 이름도 같이 넘겨주거나, 아니면 애초에 프론트엔드에서 카테고리명도 같이 넘겨주는 방법이 있음.
        id: productCategoryId,
        // name 까지 받고싶으면 2가지 방법? 1) createProductInput에서 productCategoryInput 만들고 name까지 포함시켜서 받아오기
        //                                2) result2를 만들기 전에, productCategoryId를 사용해서 카테고리 name을 조회하고, 그 name을 여기에 포함시키기
      },
      productSaleslocation: result, // result 통째로 넣기 vs id만 빼서 넣으면 ex {id: result.id} 프론트에서 등록결과를 saleslocation 까지 모두 받을수 없음.
      // productSaleslocation: {
      //   id: result.id,
      //   address: result.address,
      //   addressDetail: result.addressDetail,
      // },
      // name: createProductInput.name,
      // description: createProductInput.description,
      // price: createProductInput.price,
      // productSaleslocation: {
      //   id: result.id,
      // },
    });

    // 최종 결과 돌려주기
    return result2; // {id: uuid, name: '마우스', description: '좋은 마우스', price: 3000}
  }

  async update({ productId, updateProductInput }) {
    // save()는 insert, update 둘다 가능하고, 만든 엔티티 결과를 받음.
    // this.productsRepository.create(); // 등록을 위한 빈 객체 만들기이므로 주의. .save() 랑 착각 금지
    // this.productsRepository.insert(); //결과는 못 받는 등록 방법
    // this.productsRepository.update(); // 결과 못 받는 수정 방법

    // 수정 후 수정되지 않은 다른 결과 값까지 모두 받고 싶을 때 사용
    const myproduct = await this.productsRepository.findOne({
      where: { id: productId },
    });

    // .save({ ... })시 id가 있으면 update, 없으면 create
    // 기존에 있던 내용 추가 안해주면 업데이트 된 필드만 updateProductInput에 담겨 리턴받고 프론트엔드도 그것만 받게된다. 따라서 프론트엔드에서 정보가 더 필요하면 fetchProduct를 다시 호출해야 한다. 그렇게 안하게 하려면 백엔드에서 알아서 조회해서 모든 정보 다 채워서 넣는 방법이 있다. 프론트엔드와 협의 하기 나름 또는  회사/팀 정책에 따라 어찌 구현할지 달라진다.
    const result = this.productsRepository.save({
      ...myproduct, // 기존 정보 추가 해주기
      id: productId,
      ...updateProductInput,
      // name: '키보드',
      // description: '좋은 키보드',
      // price: 2000,
    });

    return result;
  }

  async checkSoldout({ productId }) {
    // 모든 통신, 디비 호출에 try catch 지저분하게 하기 힘드니
    // nestjs에서 HttpExceptionFilter 로 한번에 처리하게 가능.
    // try {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });

    /*
  에러란: const qqq: string = 3;
  버그란: 잘실행 작동되는듯하지만 의도하지 않은 결과나 실행하는 것
  예외란: 이미 상품이 프론트에서 백엔드 요청 했는데 서버가 꺼 있다든가 하면 예외.
   */
    console.log('isSoldout: ', product.isSoldout);

    if (product.isSoldout) {
      throw new UnprocessableEntityException('이미 판매 완료된 상품입니다');
      // 409: 중복 이메일로 가입 시도 등의 예
      // 해킹 방지를 위해 일부러 500등으로 통일해서 리턴하는 등 조작하는 경우도 있음
      // throw new HttpException('이미 판매 완료된 상품입니다.', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    // } catch (error) {
    // } finally {
    // }
  }

  async delete({ productId }) {
    // 1. 실제 삭제 - 단발성 등의 데이터들을 제외하곤 실제 삭제하지 않음
    // const result = await this.productsRepository.delete({ id: productId });
    // return result.affected ? true : false;

    // 2. 소프트 삭제 - isDeleted. 실제 삭제하지 않고 삭제된 것처럼 처리
    // this.productsRepository.update({ id: productId }, { isDeleted: true });

    // 3. 소프트 삭제 - deletedAt : null 이면 삭제안됨. 날짜가 있으면 삭제된 것처럼 처리
    // this.productsRepository.update({id: productId}, {deletedAt: new Date()});

    // 4. 소프트 삭제(TypeORM 제공) - softRemove
    // this.productsRepository.softRemove({ id: productId }); // id로만 삭제 가능

    // 5. 소프트 삭제(TypeORM 제공) - softDelete
    const result = await this.productsRepository.softDelete({ id: productId }); // 다른 컬럼으로도 삭제 가능.
    return result.affected ? true : false;
  }
}
