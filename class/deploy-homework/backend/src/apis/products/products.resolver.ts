import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateProductInput } from './dto/createProduct.input';
import { UpdateProductInput } from './dto/updateProduct.input';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Resolver()
export class ProductsResolver {
  constructor(
    private readonly productsService: ProductsService, //
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  // @Query(() => [Product]) // import 주의! @nestjs/graphql 임포트해야함.
  @Query(() => String) // import 주의! @nestjs/graphql 임포트해야함.
  async fetchProducts(
   @Args({name: "search", nullable: true}) search: string
  ) {
    /* 
      GET _search
      {
        "query": {
          "match_all": {}
        }
      }
    */
    // 엘라스틱서치에서 조회하기 연습
    // const result = await this.elasticsearchService.search({
    //   index: 'myproduct09', // 컬렉션 명
    //   query: {
    //     match_all: {}, // writer: "철수"
    //   },
    // });
    // console.log('ES:', JSON.stringify(result)); //
    // return '엘라스틱서치에서 조회 완료!!';
    const result = await this.elasticsearchService.search({
      index: 'myproduct0999',
      query: {
        match: { description: search }, // 일반적인 nGram 검색방법
        // wildcard: { description: `*${search}*` }, // 와일드카드 검색방법: nGram 없이 검색 가능하지만, 성능이 느림
      },
    });

    console.log(JSON.stringify(result, null, ' '));
    return '엘라스틱서치에서 조회 완료!!';

    // 엘라스틱서치에서 조회해보기 위해 임시로 주석
    // return this.productsService.findAll();
  }

  @Query(() => Product)
  fetchProduct(
    @Args('productId') productId: string, //
  ) {
    return this.productsService.findOne({ productId });
  }

  @Mutation(() => Product)
  // @Mutation(() => String)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput, // 이렇게 하면 아래처럼 하나하나 입력하지 않아도 됨._
  ) {
    console.log(111)
    // 엘라스틱서치에서 등록하기 연습
    // this.elasticsearchService.create({
    //   id: 'myid2',
    //   index: 'myproduct09', // 컬렉션 명
    //   document: {
    //     name: '철수',
    //     age: 13,
    //     school: '다람쥐초등학교',
    //     ...createProductInput,
    //   },
    // });

    //  엘라스틱서치에 등록 해보기 위해 임시로 주석!!
    return this.productsService.create({ createProductInput });
  }

  // 수정과, 삭제시는 민감하게 주의 해야 함.
  // 예를 들어 판매 완료후 가격 수정, 경매 완료후 가격 수정 등등
  // 따라서 이게 삭제,수정이 되는지 확인/검증 후 막야 함.
  @Mutation(() => Product)
  async updateProduct(
    @Args('productId') productId: string,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    // 인자값에 다 객체로 안묶고 따로 id만 빼서
    // 전달하는 이유는 어떤 필드를 골라서 어떤 내용을 수정할지 명확하게 하기 위해서 임.

    // 판매 완료가 되었는지 확인 로직
    await this.productsService.checkSoldout({ productId });

    // 수정하기: 수정 전 판매 가능 상태인지 판매 완료 검증 후 실행
    return this.productsService.update({ productId, updateProductInput });
  }

  @Mutation(() => Boolean)
  deleteProduct(
    @Args('productId') productId: string, //
  ) {
    return this.productsService.delete({ productId });
  }
}
