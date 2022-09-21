import { ProductCategory } from 'src/apis/productsCategories/entities/productCategory.entity';
import { ProductSaleslocation } from 'src/apis/productsSaleslocations/entities/productSaleslocation.entity';
import { ProductTag } from 'src/apis/productsTags/entities/productTag.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  // 샤딩시 숫자값으로 pk 안하고 스트링 타입의 uuid로 pk를 만듦
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  isSoldout: boolean;

  @JoinColumn()
  @OneToOne(() => ProductSaleslocation)
  productSaleslocation: ProductSaleslocation;

  // mysql에서 OneToMany 는 없는데 typeorm에서는 OneToMany를 지원함. 하지만 oneToMany만 사용하면 안되고 상대 테이블(클래스)에 ManyToOne을 해야 함.
  // ManyToOne은 원 mysql에 있으므로 ManyToOne 단독 사용 가능
  // 필요할 때 원투매니 상대 테입믈에 넣을수는 잇으나 퍼포먼스 측면에선 나쁠수 있다고 함.
  @ManyToOne(() => ProductCategory)
  productCategory: ProductCategory;

  @ManyToOne(() => User)
  user: User;

  @JoinTable() // 타입 orm이 중간 테이블을 만들어줌. 중간 테이블에 추가 컬럼을 넣어야 핦땐 직접 중간 테이블을 만들어야 함.
  @ManyToMany(() => ProductTag, (productTags) => productTags.products)
  // 이 테이블에 속한 컬럼으로 만들어지지 않음
  productTags: ProductTag[];
}
