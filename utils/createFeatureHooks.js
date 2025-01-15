const fs = require("fs");
const path = require("path");

const createFeatureHooks = (
  hooksPath,
  featureNamePascalCase,
  featureNamePluralInPascalCase,
  featureNamePlural,
  featureName
) => {
  const featureNamePluralUpperCase = featureNamePlural.toUpperCase();

  const useGetAll = `import { axiosInstance } from '@/contexts/axiosInterceptor';
import { useQuery } from '@tanstack/react-query';
import { ${featureNamePascalCase} } from '../models';
import { ResponseWithPagination } from '@/models/pagination';
import { URL_API_${featureNamePlural.toUpperCase()} } from '@/constants/api-urls.constants';

export default function useGet${featureNamePluralInPascalCase}({ pagination }: { pagination: { pageIndex: number; pageSize: number } }) {
  return useQuery({
    queryKey: ['${featureNamePlural.toLowerCase()}'],
    queryFn: async () => axiosInstance.get<ResponseWithPagination<${featureNamePascalCase}>>(\`\${URL_API_${featureNamePlural.toUpperCase()}}?page=\${pagination.pageIndex + 1}&pageSize=\${pagination.pageSize}\`),
  });
}`;
  const useGetAllFilePath = path.join(hooksPath, `useGet${featureNamePluralInPascalCase}.ts`);
  fs.writeFileSync(useGetAllFilePath, useGetAll.trim(), "utf8");

  const useGetOne = `import { axiosInstance } from '@/contexts/axiosInterceptor';
import { useQuery } from '@tanstack/react-query';
import { ${featureNamePascalCase} } from '../models';
import { URL_API_${featureNamePluralUpperCase} } from '@/constants/api-urls.constants';

export default function useGet${featureNamePascalCase}ById(id: number) {
  return useQuery({
    queryKey: ['${featureName}', id],
    queryFn: async () => axiosInstance.get<${featureNamePascalCase}>(\`\${URL_API_${featureNamePluralUpperCase}}/\${id}\`),
  });
}`;
  const useGetOneFilePath = path.join(hooksPath, `useGet${featureNamePascalCase}ById.ts`);
  fs.writeFileSync(useGetOneFilePath, useGetOne.trim(), "utf8");

  const useCreate = `import { axiosInstance } from '@/contexts/axiosInterceptor';
import { useMutation } from '@tanstack/react-query';
import { ${featureNamePascalCase}, Create${featureNamePascalCase} } from '../models';
import { URL_API_${featureNamePluralUpperCase} } from '@/constants/api-urls.constants';

export default function useCreate${featureNamePascalCase}() {
  return useMutation({
    mutationFn: async (data: Create${featureNamePascalCase}) => axiosInstance.post<${featureNamePascalCase}>(URL_API_${featureNamePluralUpperCase}, data),
  });
}`;
  const useCreateFilePath = path.join(hooksPath, `useCreate${featureNamePascalCase}.ts`);
  fs.writeFileSync(useCreateFilePath, useCreate.trim(), "utf8");

  const useUpdate = `import { axiosInstance } from '@/contexts/axiosInterceptor';
import { useMutation } from '@tanstack/react-query';
import { ${featureNamePascalCase}, Update${featureNamePascalCase} } from '../models';
import { URL_API_${featureNamePluralUpperCase} } from '@/constants/api-urls.constants';

export default function useUpdate${featureNamePascalCase}() {
  return useMutation({
    mutationFn: async (data: Update${featureNamePascalCase}) => axiosInstance.put<${featureNamePascalCase}>(URL_API_${featureNamePluralUpperCase}, data),
  });
}`;
  const useUpdateFilePath = path.join(hooksPath, `useUpdate${featureNamePascalCase}.ts`);
  fs.writeFileSync(useUpdateFilePath, useUpdate.trim(), "utf8");

  const useDelete = `import { axiosInstance } from '@/contexts/axiosInterceptor';
import { useMutation } from '@tanstack/react-query';
import { URL_API_${featureNamePluralUpperCase} } from '@/constants/api-urls.constants';

export default function useDelete${featureNamePascalCase}() {
  return useMutation({
    mutationFn: async (id: number) => axiosInstance.delete(URL_API_${featureNamePluralUpperCase}, { data: { id } }),
  });
}`;
  const useDeleteFilePath = path.join(hooksPath, `useDelete${featureNamePascalCase}.ts`);
  fs.writeFileSync(useDeleteFilePath, useDelete.trim(), "utf8");

  const useForm = `import { useForm } from 'react-hook-form';
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().nonempty("Name is required"),
});

export type ${featureNamePascalCase}FormData = z.infer<typeof schema>;

export function use${featureNamePascalCase}Form() {
  const form = useForm<${featureNamePascalCase}FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  return form;
}`;

  const useFormFilePath = path.join(hooksPath, `use${featureNamePascalCase}Form.ts`);
  fs.writeFileSync(useFormFilePath, useForm.trim(), "utf8");

  const barrel = `export * from './useGet${featureNamePluralInPascalCase}';
export * from './useGet${featureNamePascalCase}ById';
export * from './useCreate${featureNamePascalCase}';
export * from './useUpdate${featureNamePascalCase}';
export * from './useDelete${featureNamePascalCase}';
export * from './use${featureNamePascalCase}Form';`;

  const barrelFilePath = path.join(hooksPath, "index.ts");
  fs.writeFileSync(barrelFilePath, barrel.trim(), "utf8");
};

module.exports = { createFeatureHooks };
