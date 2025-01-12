const fs = require("fs");
const path = require("path");

const createFeatureTable = (basePath, featureNamePascalCase, featureName) => {
  const tableFile = path.join(basePath, `${featureNamePascalCase}Table.tsx`);
  if (!fs.existsSync(tableFile)) {
    const content = `export default function ${featureNamePascalCase}Table() {
  return (<div className="container mx-auto py-10">
    <DataTable columns={columns} data={data} />
  </div>);
};
`;
    fs.writeFileSync(tableFile, content, "utf8");
  }
};

module.exports = { createFeatureTable };
