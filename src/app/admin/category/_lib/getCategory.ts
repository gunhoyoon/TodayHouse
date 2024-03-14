export const getCategory = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/category`,
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

  return res.json();
};
