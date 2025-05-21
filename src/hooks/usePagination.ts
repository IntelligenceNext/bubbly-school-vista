
import { useState } from "react";

interface UsePaginationProps {
  initialPage?: number;
  initialPageSize?: number;
  initialTotal?: number;
}

const usePagination = ({
  initialPage = 1,
  initialPageSize = 10,
  initialTotal = 0,
}: UsePaginationProps = {}) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(initialTotal);

  const totalPages = Math.ceil(total / pageSize);

  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    total,
    setTotal,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
  };
};

export default usePagination;
