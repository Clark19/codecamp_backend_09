use myproject09;
show tables;

-- 프로시저 보기 명령 
show procedure status;

--  프로시저 생성(등록) : 세미콜론 위치 주의
create procedure mydummydata()
begin
	declare i int default 1;
	while i <= 5000000 do
		insert into board(writer, title, contents) values("철수", rand(), "반갑습니다");
		set i = i + 1;
	end while;
end;

-- 프로시저 실행 명령
call mydummydata();


-- 프로시저 실행 명령
call mydummydata();


