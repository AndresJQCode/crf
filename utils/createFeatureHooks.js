const fs = require("fs");
const path = require("path");

const createFeatureHooks = (hooksPath, featureNamePascalCase, featureName) => {
  const featureNameUpperCase = featureName.toUpperCase();

  const useGetAll = `import { axiosInstance } from '@/contexts/axiosInterceptor';
import { useQuery } from '@tanstack/react-query';
import { ${featureNamePascalCase} } from '../models';
import { ResponseWithPagination } from '@/models/pagination';
import { URL_API_${featureNameUpperCase}S } from '@/constants/api-urls.constants';

export default function useGet${featureNamePascalCase}s() {
  return useQuery({
    queryKey: ['${featureName}s'],
    queryFn: async () => axiosInstance.get<ResponseWithPagination<${featureNamePascalCase}>>(\`\${URL_API_${featureNameUpperCase}S}?page=1&pageSize=10\`),
  });
}`;
  const useGetAllFilePath = path.join(hooksPath, `useGet${featureNamePascalCase}s.ts`);
  fs.writeFileSync(useGetAllFilePath, useGetAll.trim(), "utf8");

  const useGetOne = `import { axiosInstance } from '@/contexts/axiosInterceptor';
import { useQuery } from '@tanstack/react-query';
import { ${featureNamePascalCase} } from '../models';
import { URL_API_${featureNameUpperCase}S } from '@/constants/api-urls.constants';

export default function useGet${featureNamePascalCase}ById(id: number) {
  return useQuery({
    queryKey: ['${featureName}', id],
    queryFn: async () => axiosInstance.get<${featureNamePascalCase}>(\`\${URL_API_${featureNameUpperCase}S}/\${id}\`),
  });
}`;
  const useGetOneFilePath = path.join(hooksPath, `useGet${featureNamePascalCase}ById.ts`);
  fs.writeFileSync(useGetOneFilePath, useGetOne.trim(), "utf8");

  const useCreate = `import { axiosInstance } from '@/contexts/axiosInterceptor';
import { useMutation } from '@tanstack/react-query';
import { ${featureNamePascalCase}, Create${featureNamePascalCase} } from '../models';
import { URL_API_${featureNameUpperCase}S } from '@/constants/api-urls.constants';

export default function useCreate${featureNamePascalCase}() {
  return useMutation({
    mutationFn: async (data: Create${featureNamePascalCase}) => axiosInstance.post<${featureNamePascalCase}>(URL_API_${featureNameUpperCase}S, data),
  });
}`;
  const useCreateFilePath = path.join(hooksPath, `useCreate${featureNamePascalCase}.ts`);
  fs.writeFileSync(useCreateFilePath, useCreate.trim(), "utf8");

  const useUpdate = `import { axiosInstance } from '@/contexts/axiosInterceptor';
import { useMutation } from '@tanstack/react-query';
import { ${featureNamePascalCase}, Update${featureNamePascalCase} } from '../models';
import { URL_API_${featureNameUpperCase}S } from '@/constants/api-urls.constants';

export default function useUpdate${featureNamePascalCase}() {
  return useMutation({
    mutationFn: async (data: Update${featureNamePascalCase}) => axiosInstance.put<${featureNamePascalCase}>(URL_API_${featureNameUpperCase}S, data),
  });
}`;
  const useUpdateFilePath = path.join(hooksPath, `useUpdate${featureNamePascalCase}.ts`);
  fs.writeFileSync(useUpdateFilePath, useUpdate.trim(), "utf8");

  const useDelete = `import { axiosInstance } from '@/contexts/axiosInterceptor';
import { useMutation } from '@tanstack/react-query';
import { URL_API_${featureNameUpperCase}S } from '@/constants/api-urls.constants';

export default function useDelete${featureNamePascalCase}() {
  return useMutation({
    mutationFn: async (id: number) => axiosInstance.delete(URL_API_${featureNameUpperCase}S, { data: { id } }),
  });
}`;
  const useDeleteFilePath = path.join(hooksPath, `useDelete${featureNamePascalCase}.ts`);
  fs.writeFileSync(useDeleteFilePath, useDelete.trim(), "utf8");
};

module.exports = { createFeatureHooks };
