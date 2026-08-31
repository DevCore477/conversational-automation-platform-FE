"use client";

import * as React from "react";
import { Eye, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TableColumn<T> {
  key: string;
  header: React.ReactNode;
  width?: string;
  render?: (item: T) => React.ReactNode;
  align?: "left" | "center" | "right";
  hideOnMobile?: boolean;
}

interface TableAction<T> {
  label: string;
  icon?: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick: any;
  variant?: "default" | "destructive";
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  getActions?: (item: T) => TableAction<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  getRowKey: (item: T) => string;
  onRowClick?: (item: T) => void;
  desktopGridClassName?: string;
  page?: number;
  rowsPerPage?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  rowsPerPageOptions?: number[];
}

export function Table<T>({
  data,
  columns,
  getActions,
  isLoading,
  emptyMessage = "No data found",
  getRowKey,
  onRowClick,
  desktopGridClassName,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 25, 50, 100],
}: TableProps<T>) {
  const useDesktopGrid = Boolean(desktopGridClassName);

  const headerColClass = (col: TableColumn<T>) => {
    if (useDesktopGrid) {
      return `truncate min-w-0 ${col.width ?? ""}`;
    }
    return `truncate ${col.width?.replace("w-", "min-w-") || "flex-1"}`;
  };

  const bodyColClass = (col: TableColumn<T>) => {
    if (useDesktopGrid) {
      return `min-w-0 ${col.width ?? ""}`;
    }
    return `${col.width || "flex-1"}`;
  };

  const handleRowClick = (item: T) => {
    if (onRowClick) {
      onRowClick(item);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 w-full mx-auto">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[58px] w-full rounded-full" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Eye className="size-10 lg:size-12 text-muted-foreground mb-4" />
        <h3 className="text-sm lg:text-lg font-medium mb-2">{emptyMessage}</h3>
      </div>
    );
  }

  const getAlignClass = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  return (
    <div className="w-full mx-auto flex flex-col gap-2 font-['DM_Sans'] tracking-tight overflow-x-hidden">
      {/* HEADER - Hidden on mobile, visible on desktop */}
      <div
        className={`hidden md:flex px-4 md:px-6 py-3 md:py-4 4xl:py-5 bg-[#FAF6FD] dark:bg-[#1a1a2e] rounded-full text-[#505050] dark:text-[#a0a0a0] text-[12px] 2xl:text-[14px] 4xl:text-[16px] ${useDesktopGrid
            ? `md:grid md:w-full md:items-center md:gap-2 ${desktopGridClassName}`
            : "md:flex md:items-center gap-2"
          }`}
      >
        {columns.map((col) => (
          <div
            key={col.key}
            className={`${headerColClass(col)} ${col.hideOnMobile && !useDesktopGrid ? "hidden lg:block" : ""}`}
          >
            {col.header}
          </div>
        ))}
        {getActions && (
          <div className="truncate min-w-0 text-right md:text-left">Action</div>
        )}
      </div>

      {/* ROWS */}
      <div className="flex flex-col gap-3 md:gap-0">
        {data.map((item) => (
          <div
            key={getRowKey(item)}
            onClick={() => handleRowClick(item)}
            className={`relative cursor-pointer grid grid-cols-2 gap-x-4 gap-y-3 md:gap-0 px-4 md:px-6 py-3 md:py-2 4xl:py-3 w-full min-h-[40px] 2xl:min-h-[48px] 4xl:min-h-[56px] border md:border-none md:hover:bg-muted/70 dark:hover:bg-muted/30 transition-all rounded-2xl md:rounded-full text-[#666666] dark:text-[#a0a0a0] text-[12px] 2xl:text-[14px] 4xl:text-[16px] overflow-x-hidden ${useDesktopGrid
              ? `md:grid md:w-full md:items-center md:gap-2 ${desktopGridClassName}`
              : "md:flex-row md:items-center"
            }`}
          >
            {/* {getActions && (
              <div className="col-span-2 flex justify-end shrink-0 md:hidden md:col-span-1">
                <ActionMenu actions={getActions(item)} />
              </div>
            )} */}
            {getActions && (
              <div className="absolute top-1 right-1 md:hidden">
                <ActionMenu actions={getActions(item)} />
              </div>
            )}

            {columns.map((col, index) => {
              const value = col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? "");

              return (
                <div
                  key={col.key}
                  className={`${bodyColClass(col)} ${col.hideOnMobile ? "hidden lg:block" : ""} flex flex-col gap-1 md:block`}
                >
                  {/* Mobile label */}
                  <span className="text-xs font-medium text-dark-gray dark:text-white md:hidden">
                    {col.header}
                  </span>

                  {/* Value - same for both mobile and desktop */}
                  <div className={`${index === 0 ? "font-light md:font-normal" : ""} truncate cursor-pointer`}>
                    {value}
                  </div>
                </div>
              );
            })}
            
            {getActions && (
              <div className="hidden md:flex justify-end md:justify-start mt-2 md:mt-0 shrink-0">
                <ActionMenu actions={getActions(item)} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {page !== undefined && rowsPerPage !== undefined && totalCount !== undefined && totalCount > 0 && (() => {
        const totalPages = Math.ceil(totalCount / rowsPerPage);
        const from = Math.min((page - 1) * rowsPerPage + 1, totalCount);
        const to = Math.min(page * rowsPerPage, totalCount);

        return (
          <div className="flex flex-col xs:flex-row items-center justify-center sm:justify-end gap-3 sm:gap-6 mt-4 py-3 border-t border-border/50 text-sm text-muted-foreground">
          <div className="flex items-center gap-3 sm:gap-6">
            {onRowsPerPageChange && (
              <div className="flex items-center gap-2">
                <span className="hidden sm:flex">Rows per page:</span>
                <Select
                  value={String(rowsPerPage)}
                  onValueChange={(value) => onRowsPerPageChange(Number(value))}
                >
                  <SelectTrigger className="text-sm md:text-base data-[size=default]:h-7 sm:data-[size=default]:h-10 pr-1 sm:pr-3 pl-2 sm:pl-3" showLeftBorder={false}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {rowsPerPageOptions.map((opt) => (
                      <SelectItem key={opt} value={String(opt)}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <span className="text-xs md:text-sm whitespace-nowrap">
              {from}-{to} of {totalCount}
            </span>
          </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-6 md:size-8"
                disabled={page <= 1}
                onClick={() => onPageChange?.(1)}
              >
                <ChevronsLeft className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-6 md:size-8"
                disabled={page <= 1}
                onClick={() => onPageChange?.(page - 1)}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-6 md:size-8"
                disabled={page >= totalPages}
                onClick={() => onPageChange?.(page + 1)}
              >
                <ChevronRight className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-6 md:size-8"
                disabled={page >= totalPages}
                onClick={() => onPageChange?.(totalPages)}
              >
                <ChevronsRight className="size-4" />
              </Button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function ActionMenu({ actions }: { actions: TableAction<unknown>[] }) {
  const handleActionClick = (action: TableAction<unknown>, e: React.MouseEvent) => {
    e.stopPropagation();
    action.onClick();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={(e) => e.stopPropagation()} 
        >
          <svg
            width="8"
            height="20"
            viewBox="0 0 8 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="4" cy="4" r="2" fill="#666666" />
            <circle cx="4" cy="10" r="2" fill="#666666" />
            <circle cx="4" cy="16" r="2" fill="#666666" />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl">
        {actions.map((action, index) => (
          <div key={index}>
            {index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                if (action.onClick) {
                  action.onClick(e);
                }
              }}
              className={
                action.variant === "destructive"
                  ? "text-danger-soft focus:text-destructive"
                  : ""
              }
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export type { TableColumn, TableAction };