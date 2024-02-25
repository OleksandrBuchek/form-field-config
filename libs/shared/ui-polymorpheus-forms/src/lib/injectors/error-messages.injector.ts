import { Observable, combineLatest, map } from 'rxjs';
import { injectControlConfig } from './control-config.injector';
import { getValidationParamsChanges, getValidationWithParams } from '../utils';
import { FormControlConfigValidationWithParams, FormFieldConfigBase } from '../models';
import { FormGroup } from '@angular/forms';
import { injectFieldControl } from './control.injector';
import { controlValue } from '@shared/util-forms';
import { objectEntries, objectKeys } from '@shared/util-object';
import { injectTemplateValidationParams, injectValidationParams } from './validation-params.injector';
import { asObservable } from '@shared/util-rxjs-interop';

export type ValidationParamsDefault = {
  min: number;
  max: number;
  minLength: number;
  maxLength: number;
};

const getErrorMessagesDefault = (): (() => Record<string, string>) => {
  const params = injectTemplateValidationParams<FormGroup, string, ValidationParamsDefault>();

  return () => ({
    required: 'Value is required',
    min: `Value must be greater or equal to ${params.min()}`,
    max: `Value must be less or equal to ${params.max()}`,
    minlength: `Min length is ${params.minLength()} symbols.`,
    maxlength: `Max length is ${params.maxLength()} symbols.`,
  });
};

const getErrorMessagesChanges = <Form extends FormGroup, Key extends keyof Form['controls']>(): Observable<
  Record<string, Observable<string>>
> => {
  const config = injectControlConfig<Form, Key>() as FormFieldConfigBase<Form>;
  const defaultMessagesFactory = getErrorMessagesDefault();
  const customMessagesFactory: FormControlConfigValidationWithParams<Form, Key>['messages'] =
    getValidationWithParams(config).messages ?? (() => ({}));

  const { params, deferredParams } = injectValidationParams();

  return getValidationParamsChanges(config).pipe(
    map(() => ({ ...defaultMessagesFactory(), ...customMessagesFactory({ params, deferredParams }) })),
    map((messages) =>
      objectEntries(messages).reduce(
        (acc, [key, messageOrObservable]) => ({ ...acc, [key]: asObservable(messageOrObservable) }),
        {},
      ),
    ),
  );
};

export const injectErrorMessages = <Form extends FormGroup, Key extends keyof Form['controls']>(): Observable<
  Array<{ key: string; message$: Observable<string> }>
> => {
  const control = injectFieldControl<Form, Key>();

  return combineLatest([getErrorMessagesChanges(), controlValue(control)]).pipe(
    map(([messages]) => {
      return objectKeys(control.errors ?? {}).reduce(
        (acc, key) => [...acc, { key, message$: messages[key] }],
        [] as Array<{ key: string; message$: Observable<string> }>,
      );
    }),
  );
};
