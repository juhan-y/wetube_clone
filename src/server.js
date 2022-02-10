import express from "express";
//nodejs는 똑똑하게도 node_modules폴더안에서 express를 찾는다.
// 그것이 "express"

const PORT = 4000;

const app = express(); // express application 생성.
// server는 항상 켜져있고 request를 기다리고 있다.(listening)
// 위는 application생성 부분
//ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
// app.get("/", () => console.log("Somebody is trying to go home."));
// 반드시 function을 보내야함! 그냥 console.log하면 error!
// get을 통해 request(get)에 대해 respond했을 때 function(두 번째 인자)을 실행할 수 있다.
// route(라우트): "/"(home), 실제 home에 해당하는 페이지에서만 브라우저가 계속해서 request하고 있으며
// .get함수는 실행되었지만 브라우저에는 응답을 하지 않기 떼문에
// 홈페이지가 계속 로딩중인 것이다.
// 만약 브라우저에서 "localhost:4000/lalala"에 접속한다면 Cannot GET /lalala라고 뜰 것이다.

const handleHome = (req, res) => {
  //   return res.send("I still love you"); // request를 종료.
  return res.end();
  // res.end()는 request를 종료하는 방법중 하나이다.
};
// req, res는 express에 의해서 받은 것이다. express가 없었다면
// 브라우저로부터 get함수에 의해 받을 수 없었을 것.

const handleLogin = (req, res) => {
  return res.send("Login here.");
};

app.get("/", handleHome);
app.get("/login", handleLogin);
//ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
//외부접속 listen -> 외부세계에 open
const handleListening = () =>
  console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening); //callback을 인자로 받음
// callback는 서버가 시작될 때 작동하는 함수.
// listen함수의 첫 인자는 port번호, 두 번째 인자는 callback 함수.
