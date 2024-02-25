/* eslint-disable @angular-eslint/directive-selector */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DestroyRef, Injector, Signal, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { merge } from 'rxjs';

import { FormFieldIdGenerator } from './form-field-id-generator';
import { FormGroupStatesManager } from './form-group-states-manager';
import { FormGroupValidationManager } from './form-group-validation-manager';
import { FormGroupValueChangesManager } from './form-group-value-changes-manager';
import { FormGroupLifecycleHooksManager } from './form-group-lifecycle-hooks-manager';
import { FormGroupConfig } from '../models';
import { memoUntilDestroyed } from '@shared/util-memoization';

interface FormGroupFacadeParams<Form extends FormGroup> {
  form: Form;
  config: FormGroupConfig<Form>;
  isRoot?: boolean;
}

export class FormGroupFacade<Form extends FormGroup> {
  readonly form: Form;
  readonly config: FormGroupConfig<Form>;
  readonly ids: FormFieldIdGenerator<Form>;

  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);

  private readonly statesManager: FormGroupStatesManager<Form>;
  private readonly validationManager: FormGroupValidationManager<Form>;
  private readonly valueChangesManager: FormGroupValueChangesManager<Form>;
  private readonly lifecycleHooksManager: FormGroupLifecycleHooksManager<Form>;

  private readonly getParams = memoUntilDestroyed(
    (): FormGroupFacadeParams<Form> & { injector: Injector; destroyRef: DestroyRef } => {
      return {
        ...this.params,
        injector: this.injector,
        destroyRef: this.destroyRef,
      };
    },
  );

  public readonly fieldsVisibilityMap: Record<keyof Form['controls'], Signal<boolean>>;

  constructor(private readonly params: Readonly<FormGroupFacadeParams<Form>>) {
    this.form = this.params.form;
    this.config = this.params.config;

    this.lifecycleHooksManager = new FormGroupLifecycleHooksManager(this.getParams());
    this.statesManager = new FormGroupStatesManager(this.getParams());
    this.validationManager = new FormGroupValidationManager(this.getParams());
    this.valueChangesManager = new FormGroupValueChangesManager(this.getParams());
    this.ids = new FormFieldIdGenerator(this.params.config);

    this.fieldsVisibilityMap = this.statesManager.fieldsVisibilityMap;

    merge(
      this.statesManager.statesChanges$,
      this.validationManager.validityChanges$,
      this.valueChangesManager.valueChanges$,
      this.lifecycleHooksManager.onInitChanges$,
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  showField(key: keyof Form['controls']): void {
    this.statesManager.showField(key);
  }

  hideField(key: keyof Form['controls']): void {
    this.statesManager.hideField(key);
  }

  enableField(key: keyof Form['controls']): void {
    this.statesManager.enableField(key);
  }

  disableField(key: keyof Form['controls']): void {
    this.statesManager.disableField(key);
  }
}
