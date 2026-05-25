/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  Search,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  loading?: boolean;
  isFiltering?: boolean;
  filterColumn?: string;
  filterValues?: string[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  isFiltering,
  loading,
  filterColumn,
  filterValues,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [selectedFilterValue, setSelectedFilterValue] =
    React.useState<string>("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    autoResetPageIndex: false,
    state: {
      columnFilters,
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
  });

  const handleDataChange = (value: string) => {
    setSelectedFilterValue(value);
    if (filterColumn) {
      table.getColumn(filterColumn)?.setFilterValue(value);
    }
  };

  const searchValue =
    (table.getColumn(searchKey)?.getFilterValue() as string) ?? "";

  const handleResetFilter = () => {
    setSelectedFilterValue("");
    table.getColumn(searchKey)?.setFilterValue("");
    setColumnFilters([]);
  };

  const showResetButton = searchValue || selectedFilterValue;

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-3 items-center py-4">
        <div className="flex no-print relative items-center">
          <Search className="absolute left-3 top-[33%] transform -translate-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search keyword here..."
            value={searchValue}
            onChange={(e) =>
              table.getColumn(searchKey)?.setFilterValue(e.target.value)
            }
            className="lg:w-[300px] pl-8 border border-zinc-200"
          />
        </div>
        {!isFiltering && filterValues && (
          <>
            <div className="md:w-[350px] w-full">
              <Select
                defaultValue={selectedFilterValue}
                onValueChange={handleDataChange}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder="Filter by programs"
                    className="w-full shad-select-trigger"
                  />
                </SelectTrigger>
                <SelectContent>
                  {filterValues.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {showResetButton && (
              <Button onClick={handleResetFilter} variant="secondary" size="sm">
                Reset Filter
              </Button>
            )}
          </>
        )}
      </div>
      <div className="rounded-md border max-w-full overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24">
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex md:flex-row flex-col md:items-center md:justify-between no-print gap-2 py-3">
        <p className="text-sm font-semibold text-muted-foreground">
          Showing{" "}
          {table.getRowModel().rows.length === 0
            ? 0
            : table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
              1}{" "}
          to{" "}
          {table.getRowModel().rows.length === 0
            ? 0
            : Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{" "}
          of {table.getFilteredRowModel().rows.length} results
        </p>

        <div className="flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <span className="font-semibold text-sm md:block hidden">
              Items per page
            </span>
            <Select
              value={String(table.getState().pagination.pageSize)}
              onValueChange={(e) => {
                table.setPageSize(Number(e));
              }}
            >
              <SelectTrigger className="w-[60px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 50, 100].map((pageSize) => (
                  <SelectItem key={pageSize} value={String(pageSize)}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
