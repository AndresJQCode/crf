#!/usr/bin/env node

const { Command } = require("commander");
const fs = require("fs-extra");
const path = require("path");
const { createFeatureContainer } = require("./utils/createFeatureContainer");
const { createFeatureTable } = require("./utils/createFeatureTable");
const { createFeatureDialogCreate } = require("./utils/createFeatureDialogCreate");
const { createFeatureDialogUpdate } = require("./utils/createFeatureDialogUpdate");
const { createFeatureForm } = require("./utils/createFeatureForm");
const { createFeatureContext } = require("./utils/createFeatureContext");
const { createFeatureModels } = require("./utils/createFeatureModels");
const { createFeatureHooks } = require("./utils/createFeatureHooks");
const { createComponentsBarrel } = require("./utils/createComponentsBarrel");

const program = new Command();

// Utility to convert a string to PascalCase
const toPascalCase = (str) => {
  return str.replace(/(^\w|\s\w)/g, (match) => match.trim().toUpperCase()).replace(/\s+/g, "");
};

// Utility to convert a string to plural form (basic heuristic)
const toPlural = (str) => {
  if (str.endsWith("y")) {
    return str.slice(0, -1) + "ies";
  }
  return str + "s";
};

// Function to create feature structure
const createFeature = (featureName) => {
  const featureNamePlural = toPlural(featureName);
  const featureNamePluralInPascalCase = toPascalCase(featureNamePlural);

  const featureNamePascalCase = toPascalCase(featureName);
  const basePath = path.resolve(process.cwd(), "src", "features", featureNamePlural);
  const paths = [
    path.join(basePath, "components"),
    path.join(basePath, "components", "data-table"),
    path.join(basePath, "models"),
    path.join(basePath, "hooks"),
    path.join(basePath, "context"),
  ];

  // Ensure base directory and subdirectories
  paths.forEach((dir) => fs.ensureDirSync(dir));

  // Create <FeatureName>Container.tsx file
  createFeatureContainer(
    basePath,
    featureNamePascalCase,
    featureNamePluralInPascalCase,
    featureNamePlural,
    featureName
  );

  // Create <FeatureName>Table.tsx file inside components directory
  createFeatureTable(
    path.join(basePath, "components"),
    featureNamePascalCase,
    featureNamePluralInPascalCase,
    featureNamePlural,
    featureName
  );

  // Create <FeatureName>DialogCreate.tsx file inside components directory
  createFeatureDialogCreate(
    path.join(basePath, "components"),
    featureNamePascalCase,
    featureNamePluralInPascalCase,
    featureNamePlural,
    featureName
  );

  // Create <FeatureName>DialogUpdate.tsx file inside components directory
  createFeatureDialogUpdate(
    path.join(basePath, "components"),
    featureNamePascalCase,
    featureNamePluralInPascalCase,
    featureNamePlural,
    featureName
  );

  // Create <FeatureName>  components/form
  createFeatureForm(
    path.join(basePath, "components"),
    featureNamePascalCase,
    featureNamePluralInPascalCase,
    featureNamePlural,
    featureName
  );

  // Create <FeatureName> contexts
  createFeatureContext(
    path.join(basePath, "context"),
    featureNamePascalCase,
    featureNamePluralInPascalCase,
    featureNamePlural,
    featureName
  );

  // Create <FeatureName> models
  createFeatureModels(
    path.join(basePath, "models"),
    featureNamePascalCase,
    featureNamePluralInPascalCase,
    featureNamePlural,
    featureName
  );

  // Create <FeatureName> Hooks
  createFeatureHooks(
    path.join(basePath, "hooks"),
    featureNamePascalCase,
    featureNamePluralInPascalCase,
    featureNamePlural,
    featureName
  );

  createComponentsBarrel(
    path.join(basePath, "components"),
    featureNamePascalCase,
    featureNamePluralInPascalCase,
    featureNamePlural,
    featureName
  );

  // agrega constante de la api en /src/constants/api-urls.constants.ts
  const constantsPath = path.resolve(process.cwd(), "src", "constants", "api-urls.constants.ts");
  const constants = fs.readFileSync(constantsPath, "utf8");
  const newConstants = `${constants}\nexport const URL_API_${featureNamePlural.toUpperCase()} = \`\${BASE_URL_BACKEND}/${featureNamePlural}\`;\n`;
  fs.writeFileSync(constantsPath, newConstants);

  console.log(`Feature "${featureName}" created successfully at ${basePath}`);

  // ejecutar el comando: bun run build si pasan el parametro -b o --build
  if (program.opts().build) {
    console.log("Running build...");
    const { execSync } = require("child_process");
    execSync("npm run build", { stdio: "inherit" });
  }
};

// Configure CLI
program
  .name("crf")
  .description("CLI para crear módulos CRUD en reactjs con shadcn.")
  .version("1.0.4")
  .argument("<featureName>", "Nombre en singular del feature que deseas crear.")
  // set error message on missing argument
  .showHelpAfterError()
  .addHelpText("after", `Ejemplo: crf user`)
  .action((featureName) => {
    createFeature(featureName);
  })
  .option("-b, --build", "Ejecuta el comando 'bun run build' después de crear la feature.");

program.parse(process.argv);
