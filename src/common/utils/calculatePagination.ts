export function calculatePagination(limit?: number, page?: number) {
  const take = !limit || limit < 0 ? 20 : limit;
  const skip = take * ((page || 1) - 1);

  return { take, skip };
}
