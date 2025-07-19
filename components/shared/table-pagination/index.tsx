"use client";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { ORDERS_PAGE_SIZE } from "@/lib/constants";

type TablePaginationProps = {
  totalItems: number;
  currentPage: number;
  className?: string;
};

export const TablePagination = ({
  totalItems,
  currentPage,
  className = "",
}: TablePaginationProps) => {
  const pathname = usePathname();
  const LAST_PAGE = Math.ceil(totalItems / ORDERS_PAGE_SIZE);

  const createPageLink = (page: number) => {
    if (page === 1) return pathname;

    return `${pathname}?page=${String(page)}`;
  };

  return (
    <Pagination className={cn(className)}>
      <PaginationContent className="gap-0 border rounded-lg divide-x overflow-hidden">
        {currentPage !== 1 && (
          <PaginationItem>
            <PaginationPrevious href={createPageLink(currentPage - 1)} className="rounded-none" />
          </PaginationItem>
        )}
        {currentPage !== LAST_PAGE && (
          <PaginationItem>
            <PaginationNext href={createPageLink(currentPage + 1)} className="rounded-none" />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};
