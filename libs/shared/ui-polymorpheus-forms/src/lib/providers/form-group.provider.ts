import { Provider, inject, InjectionToken } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { buildFormGroup } from '../utils/form-builder.util';
import { FormGroupFacade } from '../facade/form-group.facade';
import { FormFieldNameDirective } from '../directives';
import { FormGroupConfig } from '../models';
import { memoUntilDestroyed } from '@shared/util-memoization';
import { ValueOrFactory } from '@shared/util-types';
import { getValue } from '@shared/util-helpers';

export const provideFormGroup = <Form extends FormGroup>(
  configOrFactory: ValueOrFactory<FormGroupConfig<Form>>,
): Provider => ({
  provide: FormGroupFacade,
  useFactory: () => {
    const formGroupName = inject<FormFieldNameDirective<Form, keyof Form['controls']>>(FormFieldNameDirective, {
      optional: true,
    })?.name;

    const parentFacade = inject(FormGroupFacade, { skipSelf: true, optional: true });

    if (formGroupName && parentFacade) {
      const config = parentFacade.config.controls[formGroupName] as FormGroupConfig<Form>;
      const form = parentFacade.form.get(formGroupName as string) as Form;

      return new FormGroupFacade({ config, form });
    } else {
      const configDefault = getValue(configOrFactory);

      const form = buildFormGroup<Form>(configDefault);

      return new FormGroupFacade({ config: configDefault, form, isRoot: true });
    }
  },
});

export const ROOT_FORM_GROUP_REF = new InjectionToken<FormGroup>('ROOT_FORM_GROUP_REF');

export const injectFormGroupRoot = <Form extends FormGroup>() => inject<Form>(ROOT_FORM_GROUP_REF);

export const provideFormGroupRoot = <Form extends FormGroup>(
  configOrFactory: ValueOrFactory<FormGroupConfig<Form>>,
): Provider[] => {
  const getConfigMemoized = memoUntilDestroyed(() => getValue(configOrFactory));

  return [
    {
      provide: ROOT_FORM_GROUP_REF,
      useFactory: () => buildFormGroup<Form>(getConfigMemoized()),
    },
    {
      provide: FormGroupFacade,
      useFactory: () => {
        const form = inject<Form>(ROOT_FORM_GROUP_REF);

        return new FormGroupFacade({ config: getConfigMemoized(), form, isRoot: true });
      },
    },
  ];
};
