const fs = require("fs-extra");
const path = require("path");

const createFeatureModels = (
  modelsPath,
  featureNamePascalCase,
  featureNamePluralInPascalCase,
  featureNamePlural,
  featureName
) => {
  const featureNameUpperCase = featureName.toUpperCase();

  const modelEntity = `export interface ${featureNamePascalCase} {
  id: number;
}`;
  const modelFilePath = path.join(modelsPath, `${featureName}.type.ts`);
  fs.writeFileSync(modelFilePath, modelEntity.trim(), "utf8");

  const contextState = `import { ${featureNamePascalCase} } from './';

export type DialogActions = undefined | 'delete' | 'create' | 'update';

export type ${featureNamePascalCase}ContextAction =
  | { type: 'SET_${featureNameUpperCase}S'; payload: ${featureNamePascalCase}[] }
  | { type: 'SET_${featureNameUpperCase}'; payload: ${featureNamePascalCase} }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PAGINATION'; payload: { pageIndex: number; pageSize: number } }
  | { type: 'SET_PAGINATION_TOTAL_COUNT'; payload: number }
  | { type: 'SET_DIALOG'; payload: { action: DialogActions; open: boolean } };

export interface ${featureNamePascalCase}ContextState {
  ${featureNamePlural}: ${featureNamePascalCase}[];
  ${featureName}: ${featureNamePascalCase} | null;
  pagination: { pageIndex: number; pageSize: number };
  totalCount: number;
  loading: boolean;
  dialog: { action: DialogActions; open: boolean };
}

export const initialState: ${featureNamePascalCase}ContextState = {
  ${featureName}s: [],
  ${featureName}: null,
  pagination: {
    pageIndex: 0,
    pageSize: 10,
  },
  totalCount: 0,
  loading: false,
  dialog: { action: undefined, open: false },
}`;
  const contextStateFilePath = path.join(modelsPath, `${featureName}-context.type.ts`);
  fs.writeFileSync(contextStateFilePath, contextState.trim(), "utf8");

  // CreateEntity
  const createEntity = `export interface Create${featureNamePascalCase} {
  name: string;
}`;
  const createEntityFilePath = path.join(modelsPath, `create-${featureName}.type.ts`);
  fs.writeFileSync(createEntityFilePath, createEntity.trim(), "utf8");

  // UpdateEntity
  const updateEntity = `export interface Update${featureNamePascalCase} {
  id: number;
  name: string;
}`;
  const updateEntityFilePath = path.join(modelsPath, `update-${featureName}.type.ts`);
  fs.writeFileSync(updateEntityFilePath, updateEntity.trim(), "utf8");

  const barrelFile = `export * from './${featureName}.type';
export * from './${featureName}-context.type';
export * from './create-${featureName}.type';
export * from './update-${featureName}.type';
`;
  const barrelFilePath = path.join(modelsPath, "index.ts");
  fs.writeFileSync(barrelFilePath, barrelFile.trim(), "utf8");
};

module.exports = { createFeatureModels };
