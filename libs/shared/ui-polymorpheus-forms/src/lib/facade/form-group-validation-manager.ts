/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injector, runInInjectionContext } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { combineLatest, map, merge, Observable, tap } from 'rxjs';

import { objectEntries } from '@shared/util-object';

import { FormFieldConfigBase, FormGroupConfig, SubFormFieldConfig } from '../models';
import {
  getFormForConfig,
  getValidationParamsChanges,
  getValidationParamsSignals,
  getValidationWithParams,
} from '../utils';
import { VALIDATION_PARAMS_DEFAULT } from '../constants';

interface FormGroupValidationManagerParams<Form extends FormGroup> {
  injector: Injector;
  form: Form;
  config: FormGroupConfig<Form>;
  isRoot?: boolean;
}

export class FormGroupValidationManager<Form extends FormGroup> {
  readonly validityChanges$: Observable<void>;

  constructor(private readonly params: Readonly<FormGroupValidationManagerParams<Form>>) {
    this.buildDeferredValidators();
    this.validityChanges$ = this.getValidityChanges();
  }

  getValidityChanges(): Observable<void> {
    const changes$ = objectEntries(this.params.config.controls).map(([key, config]) =>
      this.getValidityChangesFor(config, this.params.form.get(key)!, getFormForConfig(this.params.form, key) as Form),
    );

    if (this.params.isRoot) {
      changes$.push(this.getValidityChangesFor(this.params.config, this.params.form, this.params.form));
    }

    return merge(...changes$);
  }

  getValidityChangesFor(
    config: SubFormFieldConfig<Form> | FormGroupConfig<Form>,
    control: AbstractControl,
    form: Form,
  ): Observable<void> {
    const changes$ = this.getValidityTriggerChanges(config, form).pipe(
      tap(() => {
        control.updateValueAndValidity();
      }),
    );

    return changes$.pipe(map(() => undefined));
  }

  private getValidityTriggerChanges(
    config: SubFormFieldConfig<Form> | FormGroupConfig<Form>,
    form: Form,
  ): Observable<void> {
    const validation = getValidationWithParams(config as FormFieldConfigBase<Form>);

    const changes$: Array<Observable<void | unknown>> = [
      getValidationParamsChanges(config as FormFieldConfigBase<Form>),
    ];

    if (validation.triggerOn) {
      changes$.push(runInInjectionContext(this.params.injector, () => validation.triggerOn!(form)));
    }

    return combineLatest(changes$).pipe(map(() => undefined));
  }

  private buildDeferredValidators(): void {
    objectEntries(this.params.config.controls)
      .filter(([_, config]) => this.hasDeferredValdiators(config as FormFieldConfigBase<Form>))
      .forEach(([key, config]) => {
        this.buildDeferredValidatorsFor(
          config,
          this.params.form.get(key)!,
          getFormForConfig(this.params.form, key) as Form,
        );
      });

    if (this.params.isRoot && this.hasDeferredValdiators(this.params.config)) {
      this.buildDeferredValidatorsFor(this.params.config, this.params.form, this.params.form);
    }
  }

  private buildDeferredValidatorsFor(
    config: SubFormFieldConfig<Form> | FormGroupConfig<Form>,
    control: AbstractControl,
    form: Form,
  ): void {
    const validation = getValidationWithParams(config as FormFieldConfigBase<Form>);

    const validatorsFactory = validation?.deferredValidators || (() => []);
    const asyncValidatorsFactory = validation?.deferredAsyncValidators || (() => []);

    const params = runInInjectionContext(this.params.injector, () =>
      getValidationParamsSignals(validation.params, VALIDATION_PARAMS_DEFAULT),
    );

    const deferredParams = runInInjectionContext(this.params.injector, () =>
      getValidationParamsSignals(validation.deferredParams, VALIDATION_PARAMS_DEFAULT),
    );

    control?.addValidators(
      runInInjectionContext(this.params.injector, () => validatorsFactory({ params, deferredParams, form })),
    );

    control?.addAsyncValidators(
      runInInjectionContext(this.params.injector, () => asyncValidatorsFactory({ params, deferredParams, form })),
    );

    control?.updateValueAndValidity();
  }

  private hasDeferredValdiators(config: FormFieldConfigBase<Form>): boolean {
    return Boolean(config.validation?.deferredValidators || config.validation?.deferredAsyncValidators);
  }
}
