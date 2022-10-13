
# 데이터 전체 갯수 확인
select count(*) from board
;

# 쿼리 검색 속도 비교
select *
  from board
 where title = '0.05592935537540294'
;
select *
  from board
 where number = 151
;

# 옵티마이저 실행계획 확인
explain
 select *
   from board
  where title = '0.05592935537540294'
;
explain
 select *
   from board
  where number = 151
;

# 인덱스 확인
show index from board
;

# 인덱스 생성
create index idx_title on board(title)
;

# 인덱스 확인
show index from board
;

# 옵티마이저 실행계획 확인
explain
 select *
   from board
  where title = '0.05592935537540294'
;

# 인덱싱된 컬럼으로 재쿼리 후, 성능 비교
 select *
   from board
  where title = '0.05592935537540294'
;


--  내가 짠거
-- <인덱스>
-- 테이블에 걸린 인덱스 보기 명령
show index from board;

-- 인덱스 걸기 명령
create index idx_title on board(title)


-- 쿼리 검색 속도 비교
SELECT count(*) from board
;
SELECT * from board where title = ""
;
select *
  from board
 where number = 151
;

-- 옵티마이저 실행계획 확인
explain
SELECT * from board where title = ""
;

explain
select *
  from board
 where number = 151
;

-- 인덱스 확인
show index from board
;

-- 인덱스 생성
create index idx_title on board(title)
;

-- 인덱스 확인
show index from board
;

-- 옵티마이저 실행계획 확인
explain
SELECT * from board where title = ""
;

# 인덱싱된 컬럼으로 재쿼리 후, 성능 비교
 select *
   from board
  where title = '0.05592935537540294'
;


