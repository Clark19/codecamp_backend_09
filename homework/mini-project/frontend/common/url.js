/* API Request Url용 상수
  객체나 함수로는 아래의 설계 요구사항 동시에 지원하지 않아 
    class, private, static, getter로 상수 구현
  0. 일반 상수문 형태로 사용 가능 할 것. (함수 호출문, 객체 생성문 같은 형태 X)
     ex) axios.get(RequestUrl.USERS)
  1. 같은 성격의 상수들을 하나로 패키징(캡슐화?). 
     유사한 성격의 상수 각각을 const 변수로 각각 export하지 말 것.
     묶으면 부가적으로 ide의 해당 묶음(클래스)의 프라퍼티 리스트 팝업 기능 이용가능
  2. 사용시 상수를 묶은 타입명(?)을 변경이 불가능/힘들게 하여
    일관성 없게 사용하는 것을 방지할 것.
    (export default 등으로 구현시 import시 타입명을 제각각 작명하므로
      유지보수와 협업 측면에서 좋지 않음)
  3. property(field)를 상수화 시켜 외부에서 수정 불가능 할 것.
     (객체로 묶어서 expoprt 시 내부 키의 값은 변경가능하므로 상수화 불가능)
*/
class RequestUrl {
  static #HOST = "http://127.0.0.1:3000";

  static #STARBUCKS_COFFEE_MENU = this.#HOST + "/starbucks";
  static #USERS = this.#HOST + "/users";
  static #TOKENS_PHONE = this.#HOST + "/tokens/phone";

  static get STARBUCKS_COFFEE_MENU() {
    return this.#STARBUCKS_COFFEE_MENU;
  }
  static get USERS() {
    return this.#USERS;
  }
  static get TOKENS_PHONE() {
    return this.#TOKENS_PHONE;
  }
}

Object.freeze(RequestUrl);
