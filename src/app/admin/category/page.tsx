import React from "react";
import CategoryContainer from "./_component/CategoryContainer";

export default function CategoryPage() {
  // 컨테이너 하나 만들어서 상태 여기서 가지고 있고, 함수 프롭으로 searchArea , header
  return (
    <div>
      {/* <CategoryInit /> */}
      <CategoryContainer />
    </div>
  );
}

// 페이지 단위 ssr / 내부 로직 client
