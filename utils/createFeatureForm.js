const fs = require("fs-extra");
const path = require("path");

const createFeatureForm = (basePath, featureNamePascalCase, featureName) => {
  const formFilePath = path.join(basePath, `${featureNamePascalCase}Form.tsx`);
  const formContent = `export default function ${featureNamePascalCase}Form() {
  return (
    <form>
      {/* Add form fields for ${featureName} here */}
    </form>
  );
};
`;

  fs.writeFileSync(formFilePath, formContent);
};

module.exports = { createFeatureForm };
