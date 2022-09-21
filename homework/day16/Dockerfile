FROM node:16

WORKDIR /utube/
# COPY ["./package.json", "./yarn.lock", "/utube/"]
COPY ./package.json ./yarn.lock /utube/
RUN yarn install
# 간단한 소스만 바꿔도 관련 이미지 다운, 설치를 모두 다시
# 설치하는 비효율을 방지하기 위해
# (도커 파일 순차적으로 읽으면서 캐쉬 이용할지 다시 다운/설치할지 결정하므로)
# 도커 캐쉬를 이용하기 위해 파일 복사나 설치 명령어를 위로 올리고 소스 코드
# 복사부분은 가능하면 아래로 내리는것이 좋다.

COPY . /utube/

CMD yarn start:dev