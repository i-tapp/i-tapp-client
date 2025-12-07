import React, { Dispatch, SetStateAction, useState, useCallback } from "react";
import { ClassValue } from "clsx";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/utils/tailwind";

interface SitePaginationProps {
  totalPosts: number;
  postsPerPage: number;
  paginate: (pageNum: number) => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  className?: ClassValue;
}

export function SitePagination({
  totalPosts,
  postsPerPage,
  paginate,
  currentPage,
  setCurrentPage,
  className,
}: SitePaginationProps) {
  const [pageRange, setPageRange] = useState({ a: 0, b: 3 });

  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePrevious = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((n) => n - 1);
      if (pageRange.b > 3) {
        setPageRange(({ a, b }) => ({ a: a - 1, b: b - 1 }));
      }
    }
  }, [currentPage, pageRange, setCurrentPage]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage((n) => n + 1);
      if (currentPage > 2) {
        setPageRange(({ a, b }) => ({ a: a + 1, b: b + 1 }));
      }
    }
  }, [currentPage, totalPages, setCurrentPage]);

  return (
    <Pagination className={cn(className, totalPages <= 1 && "hidden")}>
      <PaginationContent>
        <PaginationItem onClick={handlePrevious}>
          <PaginationPrevious href="#" />
        </PaginationItem>

        {pageNumbers.slice(pageRange.a, pageRange.b).map((pageNum) => (
          <PaginationItem key={pageNum} onClick={() => paginate(pageNum)}>
            <PaginationLink isActive={pageNum === currentPage} href="#">
              {pageNum}
            </PaginationLink>
          </PaginationItem>
        ))}

        {totalPages > pageRange.b && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {totalPages > pageRange.b &&
          pageNumbers.slice(totalPages - 1).map((pageNum) => (
            <PaginationItem key={pageNum} onClick={() => paginate(pageNum)}>
              <PaginationLink isActive={pageNum === currentPage} href="#">
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          ))}

        <PaginationItem onClick={handleNext}>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
