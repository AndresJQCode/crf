const fs = require("fs-extra");
const path = require("path");

const createFeatureContext = (
  contextPath,
  featureNamePascalCase,
  featureNamePluralInPascalCase,
  featureNamePlural,
  featureName
) => {
  const contextTemplate = `import { createContext } from 'react';
import { initialState, ${featureNamePascalCase}ContextState } from '../models';

export const ${featureNamePascalCase}Context = createContext<${featureNamePascalCase}ContextState>(initialState);
`;
  const contextFilePath = path.join(contextPath, `${featureName}-context.ts`);
  fs.writeFileSync(contextFilePath, contextTemplate.trim(), "utf8");

  const useContextTemaplate = `import { useContext } from 'react';
import { ${featureNamePascalCase}Context } from './${featureName}-context';

export function use${featureNamePascalCase}Context() {
  const context = useContext(${featureNamePascalCase}Context);
  if (!context) {
    throw new Error('use${featureNamePascalCase}Context must be used within a ${featureNamePascalCase}Provider');
  }
  return context;
}`;
  const useContextFilePath = path.join(contextPath, `use${featureNamePascalCase}Context.tsx`);
  fs.writeFileSync(useContextFilePath, useContextTemaplate.trim(), "utf8");

  const providerTemplate = `import { ReactNode, useReducer } from 'react';
import { ${featureNamePascalCase}Context } from './${featureName}-context';
import { initialState } from '../models';
import { ${featureName}Reducer } from './${featureName}-reducer';

export const ${featureNamePascalCase}ContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(${featureName}Reducer, initialState);

  return <${featureNamePascalCase}Context.Provider value={{ ...state, dispatch }}>{children}</${featureNamePascalCase}Context.Provider>;
};
`;
  const providerFilePath = path.join(contextPath, `${featureName}-context-provider.tsx`);
  fs.writeFileSync(providerFilePath, providerTemplate.trim(), "utf8");

  const reducerTemplate = `import { ${featureNamePascalCase}ContextState, ${featureNamePascalCase}ContextAction } from '../models';
  export function ${featureName}Reducer(state: ${featureNamePascalCase}ContextState, action: ${featureNamePascalCase}ContextAction): ${featureNamePascalCase}ContextState {
  switch (action.type) {
    case 'SET_${featureName.toUpperCase()}S':
      return {
        ...state,
        ${featureNamePlural}: action.payload,
      };
    case 'SET_${featureName.toUpperCase()}':
      return {
        ...state,
        ${featureName}: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_DIALOG':
      return {
        ...state,
        dialog: action.payload,
      };
    default:
      return state;
  }
}`;

  const reducerFilePath = path.join(contextPath, `${featureName}-reducer.ts`);
  fs.writeFileSync(reducerFilePath, reducerTemplate.trim(), "utf8");
};

module.exports = { createFeatureContext };
