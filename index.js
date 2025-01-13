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
    path.join(basePath, "components", "form"),
    path.join(basePath, "components", "data-table"),
    path.join(basePath, "models"),
    path.join(basePath, "hooks"),
    path.join(basePath, "context"),
  ];

  // Ensure base directory and subdirectories
  paths.forEach((dir) => fs.ensureDirSync(dir));

  // Create <FeatureName>Container.tsx file
  createFeatureContainer(basePath, featureNamePascalCase, featureName);

  // Create <FeatureName>Table.tsx file inside components directory
  createFeatureTable(
    path.join(basePath, "components"),
    featureNamePascalCase,
    featureNamePluralInPascalCase,
    featureNamePlural,
    featureName
  );

  // Create <FeatureName>DialogCreate.tsx file inside components directory
  createFeatureDialogCreate(path.join(basePath, "components"), featureNamePascalCase, featureName);

  // Create <FeatureName>DialogUpdate.tsx file inside components directory
  createFeatureDialogUpdate(path.join(basePath, "components"), featureNamePascalCase, featureName);

  // Create <FeatureName>  components/form
  createFeatureForm(path.join(basePath, "components", "form"), featureNamePascalCase, featureName);

  // Create <FeatureName> contexts
  createFeatureContext(
    path.join(basePath, "context"),
    featureNamePascalCase,
    featureNamePluralInPascalCase,
    featureNamePlural,
    featureName
  );

  // Create <FeatureName> models
  createFeatureModels(path.join(basePath, "models"), featureNamePascalCase, featureName);

  // Create <FeatureName> Hooks
  createFeatureHooks(path.join(basePath, "hooks"), featureNamePascalCase, featureName);

  console.log(`Feature "${featureName}" created successfully at ${basePath}`);
};

// Configure CLI
program
  .name("create-react-feature")
  .description("CLI to create React features with predefined structure")
  .version("1.0.0")
  .argument("<featureName>", "Name of the feature to create (singular)")
  .action((featureName) => {
    createFeature(featureName);
  });

program.parse(process.argv);
