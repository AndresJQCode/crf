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
import { columns, DataTableFilters } from '@/features/${featureNamePlural}/components';
import { use${featureNamePascalCase}Context } from '../context/use${featureNamePascalCase}Context';
import { getCoreRowModel, SortingState } from '@tanstack/react-table';
import { useState, useEffect } from 'react';
import SelectedRowsActions from './data-table/SelectedRowsActions';

export default function ${featureNamePluralInPascalCase}Table() {
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const { state, dispatch } = use${featureNamePascalCase}Context();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    if (pagination) {
      dispatch({
        type: 'SET_PAGINATION',
        payload: {
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        },
      });
    }
    setRowSelection({});
  }, [pagination]);

  const handleOpenDialogCreate${featureNamePascalCase} = () => {
    dispatch({ type: 'SET_DIALOG', payload: { action: 'create', open: true } });
  };

  return (<div className="container mx-auto">
    <DataTable
      isLoading={state.loading}
      filters={<DataTableFilters />}
      tooltipCreateButton='Crear ${featureName}'
      handleCreate={handleOpenDialogCreate${featureNamePascalCase}}
      selectedRowsActions={<SelectedRowsActions />}
      options={{
        data: state.${featureNamePlural},
        columns,
        getCoreRowModel: getCoreRowModel(),
        state: {
          pagination: pagination,
          rowSelection,
          sorting: sorting,
        },
        initialState: {
          columnVisibility: {
            id: false,
            lastName: false,
          },
        },
        manualPagination: true,
        rowCount: state.totalCount,
        onPaginationChange: setPagination,
        // enableRowSelection: false,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        manualSorting: true,
        // getSortedRowModel: getSortedRowModel(), //client-side sorting
      }}
    />
  </div>);
};`;
    fs.writeFileSync(tableFile, content, "utf8");
  }

  const columnsFile = path.join(basePath, "data-table", "columns.tsx");
  if (!fs.existsSync(columnsFile)) {
    const columnsContent = `import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader, Checkbox } from '@/components';
import { DataTableRowActions } from '@/features/${featureNamePlural}/components';
import { ${featureNamePascalCase} } from '@/features/${featureNamePlural}/models';

  export const columns: ColumnDef<${featureNamePascalCase}>[] = [
    { id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
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
      accessorKey: 'id',
      header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
      cell: ({ row }) => row.original.id ,
    },
    {
      id: 'actions',
      cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ];`;

    fs.writeFileSync(columnsFile, columnsContent, "utf8");
  }

  const rowActionsFile = path.join(basePath, "data-table", "DataTableRowActions.tsx");
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
          <DropdownMenuItem  onClick={() => console.log(row)}>
            <Edit2 className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => console.log(row)}>
            <Trash2 className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }`;

    fs.writeFileSync(rowActionsFile, rowActionsContent, "utf8");
  }

  const tableFiltersFile = path.join(basePath, "data-table", "DataTableFilters.tsx");
  if (!fs.existsSync(tableFiltersFile)) {
    const tableFiltersContent = `import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, ToggleGroup, ToggleGroupItem } from '@/components';

export default function DataTableFilters() {
  const [toggleValue, setToggleValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <ToggleGroup type="single" value={toggleValue} onValueChange={setToggleValue}>
        {/* Manage state */}
        <ToggleGroupItem value="" aria-label="Toggle Todos">
          Todos
        </ToggleGroupItem>
        <ToggleGroupItem value="Admin" aria-label="Toggle Admin">
          Admins
        </ToggleGroupItem>
        <ToggleGroupItem value="Customer" aria-label="Toggle Customer">
          Clientes
        </ToggleGroupItem>
        <ToggleGroupItem value="Vendor" aria-label="Toggle Vendor">
          Vendedores
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or role..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={teamFilter} onValueChange={setTeamFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Team" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            <SelectItem value="Frontend">Frontend</SelectItem>
            <SelectItem value="Backend">Backend</SelectItem>
            <SelectItem value="Design">Design</SelectItem>
            <SelectItem value="Management">Management</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}`;
    fs.writeFileSync(tableFiltersFile, tableFiltersContent, "utf8");
  }

  const tableSelectedRowsActionsFile = path.join(basePath, "data-table", "SelectedRowsActions.tsx");
  if (!fs.existsSync(tableSelectedRowsActionsFile)) {
    const tableSelectedRowsActionsContent = `import { Button } from '@/components';
export default function SelectedRowsActions() {
  return (
    <Button variant="outline" onClick={() => {}} size="sm">
      Agregar etiqueta
    </Button>
  );
}`;

    fs.writeFileSync(tableSelectedRowsActionsFile, tableSelectedRowsActionsContent, "utf8");
  }
};

module.exports = { createFeatureTable };
