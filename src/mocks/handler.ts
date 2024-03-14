import { Category } from "@/model/Categories";
import { http, HttpResponse } from "msw";
import { v4 as uuid } from "uuid";
// 핸들러에 전달될 땐 로컬에 있는 데이터 뿐만 아니라 checked + id 까지 같이 전달이 되어야함
// 핸들러에서 직접 로컬에 접근하지 못하고, 전달받는 데이터를 가지고 응답하게 되니까, 문제 없어보임
// 클라이언트에서의 삭제는 checked 를 기준으로 하고 msw쪽에서 삭제는 checked된  id로 하게 됨

// 그럼 추가할 때도 같이 보내야된다는건데, 로컬에 있는 데이터를 받아와서, checked + id 를 달아줘야하는건데
// 아니지 checked랑 id 가지고 있을 필욘 없지

// 추가할 때만 보면, 추가할 땐 name 하나 전달할거야. 그거 파싱해서 추가해주고, 성공하면 클라에서 로컬 업데이트 해줄거임

let mockCategories: Category[] = [];
console.log("msw 실행");
export const handlers = [
  http.get("/api/admin/category", () => {
    try {
      if (mockCategories.length === 0) {
        return new HttpResponse(JSON.stringify([]), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        return new HttpResponse(JSON.stringify(mockCategories), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    } catch (err) {
      console.error(err);
    }
  }),
  http.post("/api/admin/category", async ({ request }) => {
    const newCategory = await request.json();
    // console.log("시작하자마자 이게 돌긴함?");
    // DefaultBodyType 타입의 데이터가 Category[] 타입으로 간주될 수 없다는 것을 나타냅니다.
    // 즉, 여기서 DefaultBodyType은 서버에 전달된 요청의 본문(body) 타입을 의미합니다.
    // 그래서 newCategory가 Category[] 타입이 되려면, 하나하나 다 검증 해줘야한다.
    // console.log("newCategory", newCategory);
    // console.log("mockCategories", mockCategories);
    // CategoryWithCheckId 타입에 맞는지 확인
    // 이 부분에서 id까지 같이 포함해서 전달해주는 방법
    // 공백인지에 관한 조건은 클라이언트에서 애초에 입력하고 포스트할 때
    const id = uuid();

    if (
      isCategory(newCategory) &&
      !mockCategories.some(
        (category: Category) => category.name === newCategory.name
      )
    ) {
      // 하나라도 다른게 있으면 true 그럼 하나라도 같다면 false 일거아냐
      // 근데 왜 안된다느거야? 아

      console.log("if 통과");

      const categoryWithId = { ...newCategory, id };
      // console.log("categoryWithId", categoryWithId);
      mockCategories.push(categoryWithId);
      return new HttpResponse(JSON.stringify(mockCategories), {
        status: 200,
      });
    } else {
      // console.log("실패");
    }
  }),
  // 여기서 들어오는 초기 데이터는 id까지 같이 있는애임, initCateogry가 없을 쑤도 있잖아
  http.post("/api/admin/initCategory", async ({ request }) => {
    const initCategory = await request.json();
    console.log("initCategory", initCategory);
    if (!initCategory) {
      mockCategories;
    }
    // 무조건 받으면 됨.
    // console.log("상품 페이지에서 카테고리로 이동시 동작하니?");
    // console.log(initCategory);
    mockCategories = initCategory as Category[];
    // console.log("mockCategories", mockCategories);
    // if (isCategory(initCategory)) {
    //   console.log("initCategory", initCategory);
    //   mockCategories.push(initCategory);
    //   console.log("mockCategories", mockCategories);
    // } else {
    //   console.log("실패");
    // }
  }),
  http.delete(`/api/admin/category`, async ({ request }) => {
    const url = new URL(request.url);
    const categoryIds = url.searchParams.get("ids")?.split(",") || [];
    const test = mockCategories.filter(
      (category: Category) => !categoryIds.includes(category.id)
    );
    console.log("test", test);
    return new HttpResponse(JSON.stringify(test), {
      status: 200,
    });
  }),
];

function isCategory(data: any): data is Category {
  return typeof data === "object" && data !== null && "name" in data;
  // 페이로드 통해서 inputValue 들어오는데 body에 name : inputValue 가 아니라 축약으로 키, 벨류 같게 설정해놔서 타입에서 자꾸 에러나는거였음
} // 타입 가드
// 처음 앱, 수정

// handler 예시, http로 요청을 보내고, 응답은 HttpResponse 로 응답이 온다.
// /api/admin/category [GET] 전체 카테고리
// /api/admin/category [POST] 추가
// /api/admin/category/${id} [GET] 검색
// /api/admin/category/${id} [PUT] 수정 .. 아 포스트는 그냥 보내고 수정은 id를 달고 보내는구나 ㅇㅋㅇㅋㅇㅋ
// /api/admin/category/${id} [DELETE] 삭제

// /api/admin/product [GET] 전체 상품
// /api/admin/product [POST] 추가
// /api/admin/product/${id} [GET] 검색
// /api/admin/product/${id} [PUT] 수정
// /api/admin/product/${id} [DEL] 삭제
