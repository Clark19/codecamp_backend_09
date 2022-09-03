// const { ApolloServer, gql } = require('apollo-server');
import {ApolloServer, gql} from "apollo-server"
import {checkPhone, getToken, sendToToken} from "./phone.js"
// The GraphQL schema - Docs(문서) 만들어 주는 부분
// 첨부터 api docs를 만들고 실행해야 실행 된다고 하셨던듯
const typeDefs = gql`
  input CreateBoardInput {
    writer: String
    title: String
    contents: String
  }

  type MyReturn {
    number: Int
    writer: String
    title: String
    contents: String
  }

  type Query {
    # fetchBoards: MyReturn =>  객체 1개를 의미
    fetchBoards: [MyReturn] # => 배열 안의 객체(들)를 의미!
  }

  type Mutation {
    # createBoard(writer: String, title: String, contents: String): String => 입력 데이터를 낱개로 보냄
    createBoard(createBoardInput: CreateBoardInput!): String # => 입력 데이터를 묶어서 보냄(실무형)
    createTokenOfPhone(phoneNumber: String): String
  }
`;

// A map of functions which return data for the schema.
const resolvers = { // resolvers 가 api라고 함.
  Query: {
    // hello: () => 'world',
    fetchBoards: (parent, args, context, info) => {
      console.log("gql boards call")
      // 아래 같은 서버의 코드에서 이 api 호출시엔 인자가 parent 파라미터에 담겨 들어옴
      // 브라우져가 인자 넘길시엔 args에 담겨 들어옴
      // request 정보는 context.header.req 에 들어옴

      //1. 데이터 조회하는 로직 => DB에 접속해서 데이터 꺼내오기
      const result = [
        {number: 1, writer:"name1", title:"title1", contents:"content1"},
        {number: 2, writer:"name2", title:"title2", contents:"content2"},
        {number: 3, writer:"name3", title:"title3", contents:"content3"},
      ]

      console.log("gql boards end")
      
      // 2. db에서 꺼내온 결과를 브라우저에 응답(response) 주기
      return result
    },
  },

  Mutation: {
    // createBoard: (parent, args, context, info) => {
      createBoard: (_, args) => {
      // 1.클라이언트에서 보낸 데이터 확인  
      console.log("gql posts ...")
      console.log(args.createBoardInput.writer)
      console.log(args.createBoardInput.title)
      console.log(args.createBoardInput.contents)

      // fetchBoards("철수")

        // 2. 데이터 등록하는 로직 => 디비에 접속해서 데이터 저장하기
        //

        // 3. 디비에 저장이 잘됐으면 결과를 클라이언트에 응답(response) 추가
       return "게시물 등록에 성공했습니다." // .send(200)
    },
    
    createTokenOfPhone: (_, args) => {
          // 1. 휴대폰 번호 자릿수 맞는지 확인하기
      console.log("폰인증")
      const phoneNumber = args.phoneNumber
      if (!checkPhone(phoneNumber)) return
      

      // 2. 핸드폰 토큰 6자리 만들기
      const mytoken = getToken()
      if (!getToken()) return
      
      // 3. 핸드폰 번호에 토큰 전송하기(추후: 그전엔 콘솔에 출력)
      sendToToken(phoneNumber, mytoken)
      
      return "인증완료!!!"
    }
  }
};

const app = new ApolloServer({
  typeDefs,
  resolvers,
  cors: true
});

// app.listen(3000, "0.0.0.0").then(({ url }) => {
//   console.log(`🚀 Server ready at ${url}`);
// });

app.listen(3000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});