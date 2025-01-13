const fs = require("fs");
const path = require("path");

const createFeatureContainer = (basePath, featureNamePascalCase, featureName) => {
  const containerFile = path.join(basePath, `${featureNamePascalCase}sContainer.tsx`);
  if (!fs.existsSync(containerFile)) {
    const content = `import ${featureNamePascalCase}sTable from "./components/UsersTable";
    export default function ${featureNamePascalCase}sContainer() {
    return <div>
      <${featureNamePascalCase}sTable />
    </div>;
};
`;
    fs.writeFileSync(containerFile, content, "utf8");
  }
};

module.exports = { createFeatureContainer };
