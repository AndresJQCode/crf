const fs = require("fs-extra");
const path = require("path");

const createComponentsBarrel = (
  basePath,
  featureNamePascalCase,
  featureNamePluralInPascalCase,
  featureNamePlural,
  featureName
) => {
  const barrelFile = path.join(basePath, "index.ts");

  if (!fs.existsSync(barrelFile)) {
    const barrelTemplate = `export * from './${featureNamePascalCase}DialogCreate';
export * from './${featureNamePascalCase}DialogCreate';
export { default as ${featureNamePascalCase}DialogUpdate } from './${featureNamePascalCase}DialogUpdate';
export { default as ${featureNamePluralInPascalCase}Table } from './${featureNamePluralInPascalCase}Table';
export { default as DataTableFilters } from './data-table/DataTableFilters';
export * from './data-table/DataTableRowActions';
export * from './data-table/columns';
export { default as ${featureNamePascalCase}Form } from './${featureNamePascalCase}Form';`;

    fs.writeFileSync(barrelFile, barrelTemplate, "utf8");
  }
};

module.exports = { createComponentsBarrel };
