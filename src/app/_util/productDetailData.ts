const delay = (ms: number) =>
  new Promise((res) => {
    setTimeout(res, ms);
  });
// queryFn에선 useQuery를 사용할 때 전달받은 queryKey를 파라미터로 받아서 사용함.

export const ProductDetailData = async ({
  queryKey,
}: {
  queryKey: readonly [string, string, string];
}) => {
  const [, , id] = queryKey;
  await delay(100);
  const categoryRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/product/${id}`,
    {
      method: "get",
      headers: {
        "Content-Type": "appli  cation/json",
      },
    }
  );
  if (!categoryRes.ok) throw new Error("상품 데이터 가져오기 실패");

  return await categoryRes.json();
};

//ProductDetailData
