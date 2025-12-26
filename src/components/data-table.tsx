import { generateHash } from "@qui/lib/utils";
import { useMemo, type JSX } from "react";
import { Skeleton } from "./ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export type IColumn<T> = {
  key: string;
  dataIndex: string;
  title: string | JSX.Element;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (data: any, row: T) => JSX.Element | string | null;
};

type IDataTableCellProps<T, R> = {
  item?: T;
  row: R;
  className?: string;
  render?: (cell: T | undefined, row: R) => JSX.Element;
};

type IDataTableProps<T> = {
  columns: IColumn<T>[];
  data: T[];
  loading?: boolean;
};

export function TableSkeleton() {
  return (
    <div className="flex flex-col items-center gap-6">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
}

export function DataTableCell<T, R>({ className, item, row, render }: Readonly<IDataTableCellProps<T, R>>): JSX.Element {
  const getElement = useMemo(() => {
    if (render) return render(item, row);

    if (item) return <span>{item as string}</span>;

    return <></>;
  }, [render, item, row]);

  return <TableCell className={className}>{getElement}</TableCell>;
}

export function DataTable<T>({ loading, columns, data }: Readonly<IDataTableProps<T>>): JSX.Element {
  const hash = useMemo(() => {
    return generateHash();
  }, []);

  return loading ? (
    <TableSkeleton />
  ) : (
    <div className="flex flex-col gap-4">
      <Table className="text-sm">
        <TableHeader>
          <TableRow>
            {columns.map((x, index) => (
              <TableHead key={`dt-${hash}-th-${x.key}-${index}`} className={x.className}>
                {x.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, rowIndex) => (
            <TableRow key={`dt-${hash}-row-${rowIndex}`}>
              {columns.map((x, cellIndex) => (
                <DataTableCell
                  key={`datatable-cell-${rowIndex}-${cellIndex}`}
                  row={item}
                  item={item[x.dataIndex]}
                  render={x.render}
                  className={x.className}
                />
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex w-full flex-1 flex-row-reverse justify-between">
        <span className="text-sm text-gray-400">Showing 1 to 25 of 100 entries</span>
      </div>
    </div>
  );
}
