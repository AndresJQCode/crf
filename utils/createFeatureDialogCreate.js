const fs = require("fs");
const path = require("path");

const createFeatureDialogCreate = (
  basePath,
  featureNamePascalCase,
  featureNamePluralInPascalCase,
  featureNamePlural,
  featureName
) => {
  const dialogCreateFile = path.join(basePath, `${featureNamePascalCase}DialogCreate.tsx`);
  if (!fs.existsSync(dialogCreateFile)) {
    const content = `import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components';
import { use${featureNamePascalCase}Context } from '@/features/${featureNamePlural}/context/use${featureNamePascalCase}Context';
import { ${featureNamePascalCase}FormState, useCreate${featureNamePascalCase} } from '@/features/${featureNamePlural}/hooks';
import { ${featureNamePascalCase}Form } from '@/features/${featureNamePlural}/components';
import { Create${featureNamePascalCase} } from '@/features/${featureNamePlural}/models';

export function ${featureNamePascalCase}DialogCreate() {
  const { state, dispatch } = use${featureNamePascalCase}Context();
  const { mutateAsync: create${featureNamePascalCase}, isPending: isLoadingCreate${featureNamePascalCase} } = useCreate${featureNamePascalCase}();

  const onCloseCreateDialog = () => dispatch({ type: 'SET_DIALOG', payload: { action: 'create', open: false } });

  const onSubmit = async (data: ${featureNamePascalCase}FormState) => {
    try {
      const ${featureName}ToCreate: Create${featureNamePascalCase} = {
        name: data.name,
      };
      await create${featureNamePascalCase}(${featureName}ToCreate);

      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <Dialog open={state.dialog.action == 'create' && state.dialog.open} onOpenChange={onCloseCreateDialog}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear ${featureNamePascalCase}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <${featureNamePascalCase}Form onClose={onCloseCreateDialog} onSubmit={onSubmit} isLoading={isLoadingCreate${featureNamePascalCase}} />
      </DialogContent>
    </Dialog>
  );
}`;
    fs.writeFileSync(dialogCreateFile, content, "utf8");
  }
};

module.exports = { createFeatureDialogCreate };
