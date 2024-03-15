import { Category } from "@/model/Categories";
import { http, HttpResponse } from "msw";
import { v4 as uuid } from "uuid";

// 핸들러에 전달될 땐 로컬에 있는 데이터 뿐만 아니라 checked + id 까지 같이 전달이 되어야함

// 클라이언트에서의 삭제는 checked 를 기준으로 하고 msw쪽에서 삭제는 checked된  id로 하게 됨
// 그럼 추가할 때도 같이 보내야된다는건데, 로컬에 있는 데이터를 받아와서, checked + id 를 달아줘야하는건데
// 아니지 checked랑 id 가지고 있을 필욘 없지

// msw가 실행되면서 핸들러에서도 로컬 스토리지에 접근이 가능해짐

// let mockCategories: Category[] = [];
const key = "카테고리";
// if문이 자꾸 실패하니까 else문으로 넘어가는데 , else문에 return(응답) 해주고 있는게 없어서, 404가 발생하는거였음
// msw 로 실행된다고 해서 브라우저는 아니라는거같음
// 노드 환경인지에 관한 조건문으로 현재 어디서 돌고 있는지 확인

export const handlers = [
  http.get("/api/admin/category", () => {
    // console.log(typeof window !== "undefined");
    if ("document" in globalThis) {
      console.log("이프문");
      const localData = localStorage.getItem(key) || "[]";
      console.log("localData", localData);
      return new HttpResponse(localData, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      console.log("얼스");

      return new HttpResponse("실패", {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } // 아 알았다... 404는 if가 실패했는데 else 에서 반환값이 없어서 그랬던거구나
  }),
  // http.post("/api/admin/category", async ({ request }) => {
  //   const newCategory = await request.json();
  //   const id = uuid();
  //   if (typeof window !== "undefined") {
  //     const localData = localStorage.getItem(key);
  //     if (isCategory(newCategory)) {
  //     }
  //   }
  //   if (
  //     isCategory(newCategory) &&
  //     !mockCategories.some(
  //       (category: Category) => category.name === newCategory.name
  //     )
  //   ) {
  //     console.log("if 통과");

  //     const categoryWithId = { ...newCategory, id };
  //     mockCategories.push(categoryWithId);
  //     return new HttpResponse(JSON.stringify(mockCategories), {
  //       status: 200,
  //     });
  //   } else {
  //     // console.log("실패");
  //   }
  // }),
  // 여기서 들어오는 초기 데이터는 id까지 같이 있는애임, initCateogry가 없을 쑤도 있잖아
  // http.post("/api/admin/initCategory", async ({ request }) => {
  //   const initCategory = await request.json();
  //   console.log("initCategory", initCategory);
  //   if (!initCategory) {
  //     mockCategories;
  //   }
  //   // 무조건 받으면 됨.
  //   // console.log("상품 페이지에서 카테고리로 이동시 동작하니?");
  //   // console.log(initCategory);
  //   mockCategories = initCategory as Category[];
  //   // console.log("mockCategories", mockCategories);
  //   // if (isCategory(initCategory)) {
  //   //   console.log("initCategory", initCategory);
  //   //   mockCategories.push(initCategory);
  //   //   console.log("mockCategories", mockCategories);
  //   // } else {
  //   //   console.log("실패");
  //   // }
  // }),
  // http.delete(`/api/admin/category`, async ({ request }) => {
  //   const url = new URL(request.url);
  //   const categoryIds = url.searchParams.get("ids")?.split(",") || [];
  //   const test = mockCategories.filter(
  //     (category: Category) => !categoryIds.includes(category.id)
  //   );
  //   console.log("test", test);
  //   return new HttpResponse(JSON.stringify(test), {
  //     status: 200,
  //   });
  // }),
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
