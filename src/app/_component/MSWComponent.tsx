"use client";
import { useEffect } from "react";

export default function MSWComponent() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 윈도우가 있다는게 브라우저 환경이라는 뜻이니까 그 조건을 한번 거쳐서 사용
      if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
        require("@/mocks/browser");
      }
    }
  }, []);
  return null;
}
// 이 설정을 하고 layout에 임포트를 해주는거까지해야 요청을 가로채서 얘가 응답함

// 근데 실제 배포할 땐 .env 사용할거고 해당 파일을 비워놓을거니까 msw 사용 x
// 개발 시엔 env.local 사용할거고 현재 true 니까 msw 사용활거임
// 요약 : msw 개발 시에만 사용하겠다.

// 그리고 NEXT_PUBLIC 이 값이 붙으면 브라우저에서 접근 가능.
// 즉 소스 폴더 내에서 접근이 가능하지만, NEXT_PUBLIC이 붙지않고 그냥 API_MOCKING 이다 하면 서버에서만 접근 가능, 브라우저에선 못함
// 실제로 지금 NEXT_PUBLIC이 붙었기 때문에 접근해서 사용하고 있음
