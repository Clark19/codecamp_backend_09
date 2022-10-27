# 이 문서는 ./homework/main-project 에 대한 설명 문서이다

## 프로젝트 주제 설명

- 유튜브 동영상의 자막을 긁어와서 내가 원하는 형태로 FrontEnd에서 배치하여 원하는 내용이 있는지 자막 테스트를 빠르게 (눈으로 스킵하면서 검색 포함) 검색후 원하는 내용이 있으면, 클릭하여 해당 구간으로 동영상을 바로 재생할수 있게 도와주는 서비스용 백엔드 API 구현.

## 배포 주소

- park9.shop

## 기술 스택

- Javascript/TS, nestjs, GraphQL, MySQL, Redis, Elasticsearch, LogStash, Docker/Docker-Compose

## ERD 설계

- ![초기 ERD](/homework/main-project/backend/doc/ERCLOUD%20ERD_%EC%9C%A0%ED%8A%9C%EB%B8%8C%EC%98%81%EC%83%81%EB%82%B4%20%EC%9E%90%EB%A7%89%EA%B2%80%EC%83%89_%ED%95%B4%EB%8B%B9%EC%8B%9C%EA%B0%84%20%EC%9E%AC%EC%83%9D%20%EC%84%9C%EB%B9%84%EC%8A%A4.png)

## 전체적인 파이프라인 그림

- ![검색 파이프라인](/homework/main-project/backend/doc/%EA%B2%80%EC%83%89%20%EB%8F%84%EC%8B%9D%EB%8F%84%20Nest-ELK.jpg)

## API 설계

- api 목록
- fetchUsers
- fetchUsersWithDeleted
- fetchLoginUser
- createUser
- updateUser
- updateUserPwd
- deleteUser
- deleteLoginUser
- restoreUser
-
- fetchYoutubeInfos
- fetchYoutubeInfo
- createYoutubeInfo
- updateYoutubeInfo
- deleteYoutubeInfo
- restoreYoutubeInfo

## 프로젝트 설치 방법 & 실행 방법

- 우분투 또는 WSL2 우분투 터미널에서 아래 절차를 따라서 실행. 도커로 실행 되기때문에 도커이미지 안에 필요 라이브러리 설치하므로 yarn install 은 필요하지 않음. 도커 안 소스코드가 아니라 생 우분투 소스코드상의 IDE 상에서 자동 import나 자동완성, 오류체크를 지원 받고 싶을때 그땐 yarn install 을 터미널에 쳐서 관련 라이브러리를 설치해 준다.

/home/main-project/backend 로 이동
docker-compose build (당연히 도커는 설치되있어야 한다)
docker-compose up
브라우저 등의 클라이언트에서 localhost:3000/playground 에 접속하여 API(GraphQL API)를 doc을 보며 테스트 할 수 있다.

## 폴더 구조

- /homework/main-project/backend : 메인 폴더. 유튜브 영상 자막 도움 서비스 API 용 백엔드
- /homework/main-project/frontend : 회원가입, 로그인, 결제 테스트용 프론트엔드

## .env 설정

- 환결변수 설정은 로컬에서 도커로 백엔드 서버를 구동시킬때 /home/main-project/backend에 .env.docker 파일을 만들고 아래와 같이 변수에다 값을 넣어주면 된다. 빈값들은 자신만의 값들로 채워넣는다

```bash
DATABASE_TYPE=mysql
DATABASE_HOST=my-database
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=root
DATABASE_NAME=mydocker09
ACCESS_KEY=
SALT=9
REFRESH_KEY=

REDIRECT_URL=http://localhost:5500/homework/main-project/frontend/login/index.html


# - Google 소셜로그인 변수 -
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/login/google


# - Naver 소셜로그인 변수 -
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
NAVER_CALLBACK_URL=http://localhost:3000/login/naver

# - Kakao 소셜로그인 변수 -
KAKAO_CLIENT_ID=
KAKAO_CALLBACK_URL=http://localhost:3000/login/kakao

# - Iamport : imp_key, imp_secret
IAMPORT_REST_API_KEY=
IAMPORT_REST_API_SECRET=


# - GCP Storage
GCP_BUCKET_NAME=
GCP_PROJECT_ID=
GCP_KEYFILE_NAME=
```
