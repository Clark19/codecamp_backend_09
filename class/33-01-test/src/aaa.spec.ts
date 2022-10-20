// 1. 한개 테스트하기
it('더하기 테스트', () => {
  const a = 1;
  const b = 2;

  expect(a + b).toBe(3);
});

// 2. 여러개 묶음으로 테스트하기
describe('테스트 그룹명', () => {
  it('테스트명1', () => {
    //
  });

  it('더하기 테스트', () => {
    const a = 1;
    const b = 2;

    expect(a + b).toBe(3);
  });

  it('곱하기 테스트', () => {
    const a = 1;
    const b = 2;

    expect(a * b).toBe(2);
  });
});

// 3. 상품구매하기 테스트 예제
describe('상품구매하기 test Group', () => {
  // 공통로직 넣기
  beforeEach(() => {
    // 로그인 로직 작성
  });

  it('돈검증', () => {
    //
    const result = true; // 돈이 충분하다고 가정
    expect(result).toBe(true);
  });

  it('상품구매', () => {
    //
    const result = true; // 상품을 구매했다고 가정
    expect(result).toBe(true);
  });
});
