const fs = require("fs");
const path = require("path");

const createFeatureDialogUpdate = (
  basePath,
  featureNamePascalCase,
  featureNamePluralInPascalCase,
  featureNamePlural,
  featureName
) => {
  const dialogUpdateFile = path.join(basePath, `${featureNamePascalCase}DialogUpdate.tsx`);
  if (!fs.existsSync(dialogUpdateFile)) {
    const content = `export default function ${featureNamePascalCase}DialogUpdate() {
  const { state, dispatch } = use${featureNamePascalCase}Context();

  const { mutateAsync: update${featureNamePascalCase}, isPending: isLoadingUpdate${featureNamePascalCase} } = useUpdate${featureNamePascalCase}();
  const { data: ${featureName}FromApi, isPending: isLoadingGet${featureNamePascalCase}ById } = useGet${featureNamePascalCase}ById(state.${featureName}?.id);

  useEffect(() => {
    if (${featureName}FromApi) {
      dispatch({ type: 'SET_${featureName.toUpperCase()}', payload: ${featureName}FromApi });
    }
  }, [${featureName}FromApi]);

  const onCloseUpdateDialog = () => dispatch({ type: 'SET_DIALOG', payload: { action: 'update', open: false } });

  const onSubmit = async (data: ${featureNamePascalCase}FormState) => {
    try {
      if (!state.${featureName}?.id) {
        toast.error('No se ha encontrado el usuario a actualizar');
        return false;
      }

      const ${featureName}ToCreate: Update${featureNamePascalCase} = {
        id: state.${featureName}.id,
        name: data.name,
      };

      await update${featureNamePascalCase}(${featureName}ToCreate);
      return true;
    } catch (error) {
      return false;
    }
  };

  const isOpen = state.dialog.action == 'update' && state.dialog.open;

  return <Dialog open={isOpen} onOpenChange={onCloseUpdateDialog}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Actualizar ${featureName}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <${featureNamePascalCase}Form
          onClose={onCloseUpdateDialog}
          onSubmit={onSubmit}
          isLoading={isLoadingUpdate${featureNamePascalCase} || isLoadingGet${featureNamePascalCase}ById}
          ${featureName}={state.${featureName}}
        />
      </DialogContent>
    </Dialog>;
};
`;
    fs.writeFileSync(dialogUpdateFile, content, "utf8");
  }
};

module.exports = { createFeatureDialogUpdate };
