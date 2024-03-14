import { createMiddleware } from "@mswjs/http-middleware";
import express from "express";
import cors from "cors";
import { handlers } from "./handler";

const app = express();
const port = 9090; // 서버 포트 번호

// 현재 돌아가고 있는 로컬호스트 주소
app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(express.json());
app.use(createMiddleware(...handlers));
app.listen(port, () => console.log(`Mock server is running on port: ${port}`));

// nextjs에서  msw 사용하기 애매한 이유
// Msw는 클라이언트에서 서버로의 요청을 가로채서 응답을 해주는건데
// nextjs는 ssr ssg 와 같은 서버에서 미리 렌더링을 하거나, 빌드 시 서버에서 생성되는 경우
// 서버 측 네트워크 요청을 가로채지 못함. 사용자의 브라우저에서 실행되는 JavaScript 코드는 MSW에 의해 설정된 Service Worker를 통해 네트워크 요청을 보낼 수 있음
// 그래서 노드서버를 사용해줄거임
