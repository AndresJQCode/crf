const fs = require("fs");
const path = require("path");

const createFeatureDialogCreate = (basePath, featureNamePascalCase, featureName) => {
  const dialogCreateFile = path.join(basePath, `${featureNamePascalCase}DialogCreate.tsx`);
  if (!fs.existsSync(dialogCreateFile)) {
    const content = `export default function ${featureNamePascalCase}DialogCreate() {
  return <div>${featureName} Dialog Create works!</div>;
};
`;
    fs.writeFileSync(dialogCreateFile, content, "utf8");
  }
};

module.exports = { createFeatureDialogCreate };
