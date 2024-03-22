import { Category } from "@/model/Categories";
import { Product } from "@/model/Products";
import { http, HttpResponse } from "msw";

import { v4 as uuid } from "uuid";

// 핸들러에 전달될 땐 로컬에 있는 데이터 뿐만 아니라 checked + id 까지 같이 전달이 되어야함

// 클라이언트에서의 삭제는 checked 를 기준으로 하고 msw쪽에서 삭제는 checked된  id로 하게 됨
// 그럼 추가할 때도 같이 보내야된다는건데, 로컬에 있는 데이터를 받아와서, checked + id 를 달아줘야하는건데
// 아니지 checked랑 id 가지고 있을 필욘 없지

// msw가 실행되면서 핸들러에서도 로컬 스토리지에 접근이 가능해짐

// if문이 자꾸 실패하니까 else문으로 넘어가는데 , else문에 return(응답) 해주고 있는게 없어서, 404가 발생하는거였음

// 카테고리 페이지에서 새로고침할 경우 데이터를 새로받아오게 되는데 , 이때 msw가 실행되는걸 기다려줘야함
// 그로인해 delay가 필요함
// 일단 카테고리 불러오는건 init하나로 처리하고, 디비 역할을 해서 수정 삭제 츄가 와 같은 업데이트는 핸들러에서해주고
// useMutate는 클라반영만 해주기
const categoryKey = "카테고리";
const productKey = "상품";

// 에러가 발생했을 때 또는 문제해결이 필요한 상황일 떄 큰틀부터 콘솔찍어보고 세분화하면서 범위 좁히기
export const handlers = [
  http.get("/api/admin/initCategory", async () => {
    const initData = localStorage.getItem(categoryKey) || "[]";
    return new HttpResponse(initData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),
  http.get("/api/admin/searchCategory", async ({ request }) => {
    const url = new URL(request.url);
    // console.log("url", url);
    const keyword = url?.searchParams.get("searchTerm");
    // console.log("keyword", keyword);
    const initData = localStorage.getItem(categoryKey) || "[]";

    let copyData: Category[] = JSON.parse(initData);
    //
    try {
      // 문자열을 JSON으로 파싱하여 배열로 변환

      // Array.isArray를 사용하여 배열인지 확인
      if (!Array.isArray(copyData)) {
        console.error("Stored data is not an array");
        copyData = []; // 유효하지 않은 경우 빈 배열로 초기화
      } else {
        const filterCategories = copyData.filter((category: Category) =>
          category.name.includes(keyword as string)
        );
        // 배열 타입을 다시 JSON 으로
        const searchResults = JSON.stringify(filterCategories);
        // 카테고리가 있을 때
        // console.log("searchResults", searchResults);
        if (keyword !== null && keyword !== "") {
          return new Response(searchResults, {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          });
          // 입력값이 없을 때 keyword null로 전달됨
        } else if (keyword === "") {
          // console.log("이 조건에 걸리겠지?");
          return new Response(initData, {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          });
          // 존재하지 않는 카테고리를 입력할 때
        } else {
          return new Response(JSON.stringify([]), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          });
        }
      }
    } catch (error) {
      console.error("Error parsing stored data: ", error);
      copyData = []; // 오류 발생 시 빈 배열로 초기화
    }
  }),

  // 아 알았다... 404는 if가 실패했는데 else 에서 반환값이 없어서 그랬던거구나

  http.post("/api/admin/category", async ({ request }) => {
    const newCategory = await request.json();
    const id = uuid();
    const rawData = localStorage.getItem(categoryKey) || "[]";
    const initData: Category[] = JSON.parse(rawData);
    if (
      isCategory(newCategory) &&
      !initData.some((category: Category) => category.name === newCategory.name)
    ) {
      console.log("if 통과");

      const categoryWithId = { ...newCategory, id };
      initData.push(categoryWithId);
      localStorage.setItem(categoryKey, JSON.stringify(initData));
      return new HttpResponse(JSON.stringify(initData), {
        status: 200,
      });
    } else {
      console.log("포스트 실패");
      return new HttpResponse(JSON.stringify({ message: "추가 실패" }), {
        status: 400,
      });
    }
  }),
  http.delete(`/api/admin/category`, async ({ request }) => {
    // 선택삭제, 전체삭제 전부 처리
    console.log("요청 전달이 되남?");
    const url = new URL(request.url);
    console.log("url", url);
    const rawData = localStorage.getItem(categoryKey) || "[]";
    const initData: Category[] = JSON.parse(rawData);
    console.log("initData", initData);
    const categoryIds = url.searchParams.get("ids")?.split(",") || [];
    console.log("categoryIds", categoryIds);
    const filteredCategories = initData.filter(
      (category: Category) => !categoryIds.includes(category.id)
    );
    //
    localStorage.setItem(categoryKey, JSON.stringify(filteredCategories));
    return new HttpResponse(JSON.stringify(filteredCategories), {
      status: 200,
    });
    // if (isCategory(initData)) {
    // } else {
    //   console.log("삭제 조건문 else");
    //   return new HttpResponse(JSON.stringify({ message: "삭제 실패" }), {
    //     status: 400,
    //   });
    // }
  }),

  // 앱 진입 시 초기에 불러올 카테고리 데이터

  http.get("/api/admin/initProduct", async () => {
    const initData = localStorage.getItem(productKey) || "[]";
    // const test = JSON.parse(initData);
    // console.log(test);
    // console.log(test[0].image);
    // console.log("initData", JSON.parse(initData));
    return new Response(initData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),

  http.post("/api/admin/product", async ({ request }) => {
    const rawData = localStorage.getItem(productKey) || "[]";
    const initData: Product[] = JSON.parse(rawData);

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const base64Image = formData.get("image") as string;
    const price = formData.get("price") as string;
    const description = formData.get("description") as string;
    const id = uuid();
    const imageFileName = `${id}.png`;
    const categoryData = formData.get("category");
    const category = transformCategory(categoryData);
    if (!category) {
      return new Response(JSON.stringify("카테고리 파싱 실패"), {
        status: 400, // 잘못된 요청
      });
    }

    let mimeType = "image/png"; // 초기값으로 png MIME 타입 설정

    // 파일명에서 확장자 추출
    const extension = imageFileName.split(".").pop() as string;

    // 확장자에 따른 MIME 타입 설정
    switch (extension.toLowerCase()) {
      case "jpg":
      case "jpeg":
        // 두 타입은 동일한 이미지 파일 형식을 나타낸다.
        mimeType = "image/jpeg";
        break;
      case "png":
        mimeType = "image/png";
        break;
      case "gif":
        mimeType = "image/gif";
        break;
      // 추가적인 확장자에 대한 처리를 여기에 추가할 수 있습니다.
      default:
        // 처리할 수 없는 확장자인 경우 기본적으로 설정된 MIME 타입을 사용합니다.
        break;
    }

    // 여기서 현재 JSON 으로 들어오게 됨, 왜냐 formData엔 키-값 하나의 쌍만 담을 수 있는데,
    // 현재 카테고리는 {id:string,name:string} 타입을 가지고 있으므로, JSON으로 변환해서 담았기 떄문ㅇ

    // 확장자에 따른 처리 필요

    // localStorage.setItem(imageFileName, JSON.stringify(base64Image));
    const productData: Product = {
      category: category,
      price: price,
      description: description,
      name: name,
      id: id,
      image: {
        [imageFileName]: base64Image,
      },
    };

    // id가 매번 달라질 수 있는데 이름을 뭘로 정의하지

    // image: {
    //   id: imageFileName, // 이미지 파일명을 저장
    // },
    // 이미지 아디를 가지고 있음, 안쓰는 경우는 나눠놓은거임.

    initData.unshift(productData);
    localStorage.setItem(productKey, JSON.stringify(initData));
    return new Response(JSON.stringify(initData), {
      status: 200,
    });
  }),
];

function isCategory(data: any): data is Category {
  return typeof data === "object" && data !== null && "name" in data;
  // 페이로드 통해서 inputValue 들어오는데 body에 name : inputValue 가 아니라 축약으로 키, 벨류 같게 설정해놔서 타입에서 자꾸 에러나는거였음
} // 타입 가드
function transformCategory(
  categoryData: FormDataEntryValue | null
): { name: string; id: string } | null {
  if (categoryData && typeof categoryData === "string") {
    try {
      return JSON.parse(categoryData);
    } catch (e) {
      console.error("JSON 파싱 실패", e);
      return null;
    }
  }
  return null;
}

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
