interface IProfile {
  name: string;
  age: number;
  school: string;
  hobby?: string;
}

// 1. Partial 타입
type aaa = Partial<IProfile>; // IProfile의 모든 속성을 선택적으로 만들어준다.

// 2. Required 타입
type bbb = Required<IProfile>; // IProfile의 모든 속성을 필수로 만들어준다의.

// 3. Pick 타입
type ccc = Pick<IProfile, "name" | "age">; // IProfile에서 name과 age만 뽑아서 새로운 타입을 만들어준다.

// 4. Omit 타입, 속성 선택해서 그 속성만 빼는거
type ddd = Omit<IProfile, "school">; // IProfile에서 school을 빼고 새로운 타입을 만들어준다.

// 5. Record 타입
// Union 타입
type eee = "철수" | "영희" | "훈이"; // Union 타입
let child: eee; // "철수" | "영희" | "훈이" 중에서의 값만 가질 수 있다.
child = "철수";

// Record 타입
type fff = Record<eee, IProfile>; // Record<Union 타입, 타입> 이렇게 사용하면 Union 타입의 값들을 key로 가지고 타입을 value로 가지는 타입을 만들어준다.

let myKey: keyof IProfile; // IProfile의 key들만 뽑아서 Union 타입으로 만들어준다.
myKey = "name"; // name은 IProfile의 key이기 때문에 가능

// ====  (type vs interface) 차이: 선언 병합 ======
interface IProfile {
  candy: number;
}

let profile: Partial<IProfile> = {
  candy: 10, // 선언병합으로 추가됨
};
