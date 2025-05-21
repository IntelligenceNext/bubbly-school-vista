
import { useState } from "react";

interface UsePaginationProps {
  initialPage?: number;
  initialPageSize?: number;
  initialTotal?: number;
}

const usePagination = ({
  initialPage = 0, // Changed from 1 to 0 to match the usage in Inquiries.tsx
  initialPageSize = 10,
  initialTotal = 0,
}: UsePaginationProps = {}) => {
  const [pageIndex, setPageIndex] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(initialTotal);

  // Calculate page count based on total and page size
  const pageCount = Math.ceil(total / pageSize);

  // Function to set the total count
  const setTotalCount = (count: number) => {
    setTotal(count);
  };

  const nextPage = () => {
    if (pageIndex < pageCount - 1) {
      setPageIndex(pageIndex + 1);
    }
  };

  const prevPage = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 0 && newPage < pageCount) {
      setPageIndex(newPage);
    }
  };

  // For backward compatibility with existing code
  const page = pageIndex + 1;
  const setPage = (newPage: number) => setPageIndex(newPage - 1);
  const totalPages = pageCount;

  return {
    // New properties
    pageIndex,
    setPageIndex,
    pageCount,
    setTotalCount,
    
    // Original properties
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
