const fs = require("fs-extra");
const path = require("path");

const createFeatureTable = (
  basePath,
  featureNamePascalCase,
  featureNamePluralInPascalCase,
  featureNamePlural,
  featureName
) => {
  const tableFile = path.join(basePath, `${featureNamePluralInPascalCase}Table.tsx`);
  if (!fs.existsSync(tableFile)) {
    const content = `import { DataTable } from '@/components';
import { columns } from './data-table/columns';
import { use${featureNamePascalCase}Context } from '../context/use${featureNamePascalCase}Context';

export default function ${featureNamePluralInPascalCase}Table() {
  const { state } = use${featureNamePascalCase}Context();

  return (<div className="container mx-auto py-10">
    <DataTable columns={columns} data={state.${featureNamePlural}} />
  </div>);
};`;
    fs.writeFileSync(tableFile, content, "utf8");
  }

  const columnsFile = path.join(basePath, "data-table", "columns.tsx");
  if (!fs.existsSync(columnsFile)) {
    const columnsContent = `import { ColumnDef } from '@tanstack/react-table';
  import { Checkbox } from "@/components/ui/checkbox";
  import { DataTableRowActions } from "./data-table-row-actions";
  import { ${featureNamePascalCase} } from '../../models';

  export const columns: ColumnDef<${featureNamePascalCase}>[] = [
    { id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
      enableHiding: false
    },
    {
      id: "actions",
      cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ];`;

    fs.writeFileSync(columnsFile, columnsContent, "utf8");
  }

  const rowActionsFile = path.join(basePath, "data-table", "data-table-row-actions.tsx");
  if (!fs.existsSync(rowActionsFile)) {
    const rowActionsContent = `import { DotsHorizontalIcon } from '@radix-ui/react-icons';
  import { Row } from '@tanstack/react-table';

  import { Button } from '@/components/ui/button';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
  import { Edit2, Trash2 } from 'lucide-react';

  interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
  }

  export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem>
            <Edit2 className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  `;
    fs.writeFileSync(rowActionsFile, rowActionsContent, "utf8");
  }
};

module.exports = { createFeatureTable };
