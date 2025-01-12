const fs = require("fs");
const path = require("path");

const createFeatureDialogUpdate = (basePath, featureNamePascalCase, featureName) => {
  const dialogUpdateFile = path.join(basePath, `${featureNamePascalCase}DialogUpdate.tsx`);
  if (!fs.existsSync(dialogUpdateFile)) {
    const content = `export default function ${featureNamePascalCase}DialogUpdate() {
  return <div>${featureName} Dialog Update works!</div>;
};
`;
    fs.writeFileSync(dialogUpdateFile, content, "utf8");
  }
};

module.exports = { createFeatureDialogUpdate };
