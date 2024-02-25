/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injector, runInInjectionContext } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { distinctUntilChanged, map, merge, Observable, tap } from 'rxjs';

import { controlValue } from '@shared/util-forms';
import { objectEntries } from '@shared/util-object';

import { FormFieldConfigActionsMap, FormGroupConfig, OnChangeAsyncFn, OnChangeFn, SubFormFieldConfig } from '../models';
import { getFormForConfig } from '../utils';
import { isEqual } from '@shared/util-helpers';

interface FormGroupValueChangesManagerParams<Form extends FormGroup> {
  injector: Injector;
  form: Form;
  config: FormGroupConfig<Form>;
  isRoot?: boolean;
}

export class FormGroupValueChangesManager<Form extends FormGroup> {
  readonly valueChanges$: Observable<void>;

  constructor(private readonly params: Readonly<FormGroupValueChangesManagerParams<Form>>) {
    this.valueChanges$ = this.getValueChanges();
  }

  getValueChanges(): Observable<void> {
    const changes$ = objectEntries(this.params.config.controls).map(([key, config]) =>
      this.getValueChangesFor(config, this.params.form.get(key)!, getFormForConfig(this.params.form, key) as Form),
    );

    if (this.params.isRoot) {
      changes$.push(this.getValueChangesFor(this.params.config, this.params.form, this.params.form));
    }

    return merge(...changes$);
  }

  private getValueChangesFor(
    config: SubFormFieldConfig<Form> | FormGroupConfig<Form>,
    control: AbstractControl,
    form: Form,
  ): Observable<void> {
    const { onChange, onChangeAsync } = this.getActionsMap(config);

    const controlValueChanges$ = controlValue(control).pipe(
      distinctUntilChanged(isEqual),
      tap((formValue) => {
        onChange(formValue, form);
      }),
    );

    const changes$ = runInInjectionContext(this.params.injector, () => onChangeAsync(controlValueChanges$, form));

    return changes$.pipe(map(() => undefined));
  }

  private getActionsMap(config: SubFormFieldConfig<Form> | FormGroupConfig<Form>): FormFieldConfigActionsMap<Form> {
    const onChange = (config.actions?.onChange ?? (() => undefined)) as OnChangeFn<Form>;
    const onChangeAsync = (config.actions?.onChangeAsync ??
      ((state$: Observable<Form['value']>) => state$)) as OnChangeAsyncFn<Form>;

    return {
      onChange,
      onChangeAsync,
    };
  }
}
