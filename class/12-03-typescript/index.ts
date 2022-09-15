// 타입추론
let aaa = "안녕하세요";
aaa = 3;

// 타입명시
let bbb: string = "안녕하세요";
bbb = 10;

// 타입명시가 필요한 상황
let ccc: string | number = 1000;
ccc = "1000원";

// 숫자타입
let ddd: number = 10;
ddd = "철수";

// 불린타입
let eee: boolean = true;
eee = false;
eee = "false"; // true로 작동함

// 배열타입
let fff: number[] = [1, 2, 3, 4, 5, "안녕하세요"];
let ggg: string[] = ["철수", "영희", "훈이", 10];
let hhh: (string | number)[] = ["철수", "영희", "훈이", 10]; // 타입을 추론해서 어떤 타입을 사용하는지 알아보기

// 객체타입
interface IProfile {
  name: string;
  age: number | string;
  school: string;
  hobby?: string; // ?를 붙이면 선택적으로 사용할 수 있음. 필수가 아님
}

const profile: IProfile = {
  name: "철수",
  age: 8,
  school: "다람쥐초등학교",
};
profile.hobby = "수영";
profile.name = "영희";
profile.age = "8살";

// 함수타입 은 매개변수를 다양하게 넣어서 호출 가능하므로 타입 추론 불가능하므로
// 타입을 꼭 명시해줘야함
// 함수타입 => 어디서든 몇번이든 호출 가능하므로, 타입 추론 할 수 없음(반드시, 타입명시 필요!!)
function add1(num1: number, num2: number, unit: string): string {
  return num1 + num2 + unit;
}
// add1(1000, 2000, "원");
// add1("1000", "2000", "원");
const result1 = add1(1000, 2000, "원"); // 결과의 리턴 타입도 예측 가능!

const add2 = (num1: number, num2: number, unit: string): string => {
  return num1 + num2 + unit;
};
const result2 = add2(1000, 2000, "원");

// any 타입
let qqq: any = "철수"; // 자바스크립트와 동일! 가급적 사용하지 않는 것이 좋음. 쓰면 타입스크립트를 사용할 필요가 없음
qqq = 123;
qqq = true;
