const fs = require("fs-extra");
const path = require("path");

const createFeatureForm = (
  basePath,
  featureNamePascalCase,
  featureNamePluralInPascalCase,
  featureNamePlural,
  featureName
) => {
  const formFilePath = path.join(basePath, `${featureNamePascalCase}Form.tsx`);
  const formContent = `import { useEffect } from 'react';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, LoadingButton } from '@/components';
import { ${featureNamePascalCase}FormState, use${featureNamePascalCase}Form } from '@/features/${featureNamePlural}/hooks';
import { ${featureNamePascalCase} } from '@/features/${featureNamePlural}/models';

interface Props {
  onSubmit: (data: ${featureNamePascalCase}FormState) => Promise<boolean>;
  onClose: () => void;
  ${featureName}?: ${featureNamePascalCase};
  isLoading?: boolean;
}
export default function ${featureNamePascalCase}Form({ onClose, onSubmit, ${featureName}, isLoading = false }: Readonly<Props>) {
  const form = use${featureNamePascalCase}Form();

  const handlerSubmit = async (data: ${featureNamePascalCase}FormState) => {
    const submitSuccess = await onSubmit(data);

    if (submitSuccess) {
      form.reset();
      onClose();
    }
  };

  useEffect(() => {
    if (${featureName}) {
      form.reset({
        name: ${featureName}.name
      });
    }
  }, [${featureName}]);
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handlerSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-full flex justify-end gap-2">
            <LoadingButton type="submit" text="Guardar" isLoading={isLoading} />
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
`;

  fs.writeFileSync(formFilePath, formContent);
};

module.exports = { createFeatureForm };
