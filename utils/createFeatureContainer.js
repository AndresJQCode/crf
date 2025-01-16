const fs = require("fs");
const path = require("path");

const createFeatureContainer = (
  basePath,
  featureNamePascalCase,
  featureNamePluralInPascalCase,
  featureNamePlural,
  featureName
) => {
  const containerFile = path.join(basePath, `${featureNamePluralInPascalCase}Container.tsx`);
  if (!fs.existsSync(containerFile)) {
    const content = `import { ${featureNamePluralInPascalCase}Table, ${featureNamePascalCase}DialogCreate } from "./components";

export default function ${featureNamePluralInPascalCase}Container() {
    return <div>
      <${featureNamePluralInPascalCase}Table />
      <${featureNamePascalCase}DialogCreate />
    </div>;
};
`;
    fs.writeFileSync(containerFile, content, "utf8");
  }
};

module.exports = { createFeatureContainer };
