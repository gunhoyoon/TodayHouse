const delay = (ms: number) =>
  new Promise((res) => {
    setTimeout(res, ms);
  });

export const InitCategoryData = async () => {
  await delay(100);
  const categoryRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/initCategory`,
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!categoryRes.ok) throw new Error("첫 번째 요청 실패");

  return await categoryRes.json();
};
