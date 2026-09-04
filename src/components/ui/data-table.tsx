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
  RowSelectionState,
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
  Trash,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Checkbox } from "./checkbox";
import AlertModal from "./alert-modal";

interface DataTableProps<TData extends { id: string }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  loading?: boolean;
  isFiltering?: boolean;
  filterColumn?: string;
  filterValues?: string[];
  filterPlaceholder?: string;
  enableBatchDelete?: boolean;
  onBatchDelete?: (ids: string[]) => Promise<void> | void;
  batchDeleteLoading?: boolean;
}

export function DataTable<TData extends { id: string }, TValue>({
  columns,
  data,
  searchKey,
  isFiltering,
  loading,
  filterColumn,
  filterValues,
  filterPlaceholder = "Filter by programs",
  enableBatchDelete,
  onBatchDelete,
  batchDeleteLoading = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [batchDeleteOpen, setBatchDeleteOpen] = React.useState(false);
  const [selectedFilterValue, setSelectedFilterValue] =
    React.useState<string>("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const tableColumns = React.useMemo<ColumnDef<TData, TValue>[]>(() => {
    if (!enableBatchDelete) {
      return columns;
    }

    const selectColumn: ColumnDef<TData, TValue> = {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    };

    return [selectColumn, ...columns];
  }, [columns, enableBatchDelete]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    autoResetPageIndex: false,
    state: {
      columnFilters,
      sorting,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getSortedRowModel: getSortedRowModel(),
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedIds = selectedRows.map((row) => row.original.id);

  const handleBatchDelete = async () => {
    if (!onBatchDelete || selectedIds.length === 0) {
      return;
    }

    await onBatchDelete(selectedIds);
    setRowSelection({});
    setBatchDeleteOpen(false);
  };

  const handleDataChange = (value: string) => {
    setSelectedFilterValue(value);
    if (filterColumn) {
      table.getColumn(filterColumn)?.setFilterValue(value);
    }
    table.setPageIndex(0);
  };

  const searchValue =
    (table.getColumn(searchKey)?.getFilterValue() as string) ?? "";

  const handleResetFilter = () => {
    setSelectedFilterValue("");
    table.getColumn(searchKey)?.setFilterValue("");
    setColumnFilters([]);
    table.setPageIndex(0);
  };

  React.useEffect(() => {
    const pageIndex = table.getState().pagination.pageIndex;
    const pageCount = table.getPageCount();

    if (pageIndex === 0) {
      return;
    }

    if (pageCount === 0) {
      table.setPageIndex(0);
      return;
    }

    if (pageIndex >= pageCount) {
      table.setPageIndex(pageCount - 1);
    }
  }, [data.length, table]);

  const showResetButton = searchValue || selectedFilterValue;

  return (
    <div className="overflow-x-auto">
      {enableBatchDelete && (
        <AlertModal
          isOpen={batchDeleteOpen}
          onClose={() => setBatchDeleteOpen(false)}
          loading={batchDeleteLoading}
          onConfirm={handleBatchDelete}
          title={`Delete ${selectedIds.length} selected item${
            selectedIds.length === 1 ? "" : "s"
          }?`}
        />
      )}
      <div className="flex gap-3 items-center py-4">
        <div className="flex no-print relative items-center">
          <Search className="absolute left-3 top-[33%] transform -translate-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search keyword here..."
            value={searchValue}
            onChange={(e) => {
              table.getColumn(searchKey)?.setFilterValue(e.target.value);
              table.setPageIndex(0);
            }}
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
                <SelectTrigger className="w-full truncate overflow-hidden">
                  <SelectValue
                    placeholder={filterPlaceholder}
                    className="w-full truncate shad-select-trigger"
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
        {enableBatchDelete && (
          <Button
            disabled={selectedIds.length === 0 || batchDeleteLoading}
            onClick={() => setBatchDeleteOpen(true)}
            size="sm"
            type="button"
            variant="destructive"
          >
            <Trash className="w-4 h-4 mr-2" />
            Delete selected
          </Button>
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
                <TableCell colSpan={tableColumns.length} className="h-24">
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
                  colSpan={tableColumns.length}
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
