export const getCategory = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/initCategory`,

    {
      next: {
        tags: ["admin", "category"],
      },
      credentials: "include",
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  // console.log(res.json());
  return res.json();
};

// 카테고리 페이지에 들어와서 새로고침할 경우, 역시 마찬가지로 category 요청을 하는데
//
