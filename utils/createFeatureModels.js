const fs = require("fs-extra");
const path = require("path");

const createFeatureModels = (modelsPath, featureNamePascalCase, featureName) => {
  const modelEntity = `export interface ${featureNamePascalCase} {
  id: number;
}
`;
  const modelFilePath = path.join(modelsPath, `${featureName}.type.ts`);
  fs.writeFileSync(modelFilePath, modelEntity.trim(), "utf8");

  const featureNameUpperCase = featureName.toUpperCase();
  const contextState = `import { ActionDispatch } from 'react';
import { ${featureNamePascalCase} } from './';

export type DialogAction = undefined | 'delete' | 'create' | 'update';

export interface ${featureNamePascalCase}ContextState {
  ${featureName}s: ${featureNamePascalCase}[];
  ${featureName}: ${featureNamePascalCase} | null;
  loading: boolean;
  dialog: { action: DialogAction; open: boolean };
  dispatch: ActionDispatch<[action: ${featureNamePascalCase}ContextAction]>;
}

export type ${featureNamePascalCase}ContextAction =
  | { type: 'SET_${featureNameUpperCase}S'; payload: ${featureNamePascalCase}[] }
  | { type: 'SET_${featureNameUpperCase}'; payload: ${featureNamePascalCase} }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DIALOG'; payload: { action: 'delete' | 'create' | 'update'; open: boolean } };

export interface ${featureNamePascalCase}ContextType {
  state: ${featureNamePascalCase}ContextState;
  dispatch: React.Dispatch<${featureNamePascalCase}ContextAction>;
}

export const initialState: ${featureNamePascalCase}ContextState = {
  ${featureName}s: [],
  dispatch: () => {},
  ${featureName}: null,
  loading: false,
  dialog: { action: undefined, open: false },
};`;
  const contextStateFilePath = path.join(modelsPath, `${featureName}-context.type.ts`);
  fs.writeFileSync(contextStateFilePath, contextState.trim(), "utf8");

  const barrelFile = `export * from './${featureName}.type';
export * from './${featureName}-context.type';`;
  const barrelFilePath = path.join(modelsPath, "index.ts");
  fs.writeFileSync(barrelFilePath, barrelFile.trim(), "utf8");
};

module.exports = { createFeatureModels };
