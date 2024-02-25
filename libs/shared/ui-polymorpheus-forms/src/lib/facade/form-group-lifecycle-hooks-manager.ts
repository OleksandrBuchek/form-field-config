/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DestroyRef, Injector, runInInjectionContext } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { objectEntries } from '@shared/util-object';
import { FormGroupConfig, SubFormFieldConfig } from '../models';
import { Observable, distinctUntilChanged, isObservable, map, merge, of } from 'rxjs';
import { getFormForConfig } from '../utils';
import { isEqual } from '@shared/util-helpers';

interface FormGroupLifecycleHooksManagerParams<Form extends FormGroup> {
  injector: Injector;
  form: Form;
  config: FormGroupConfig<Form>;
  destroyRef: DestroyRef;
  isRoot?: boolean;
}

export class FormGroupLifecycleHooksManager<Form extends FormGroup> {
  readonly onInitChanges$: Observable<void>;

  constructor(private readonly params: FormGroupLifecycleHooksManagerParams<Form>) {
    this.onInitChanges$ = this.getOnInitChanges();
    this.handleOnDestroy();
  }

  private getOnInitChanges(): Observable<void> {
    const changes$ = objectEntries(this.params.config.controls).map(([key, config]) =>
      this.getOnInitChangesFor(config, getFormForConfig(this.params.form, key) as Form),
    );

    if (this.params.isRoot) {
      changes$.push(this.getOnInitChangesFor(this.params.config, this.params.form));
    }

    return merge(...changes$);
  }

  private handleOnDestroy(): void {
    this.params.destroyRef.onDestroy(() => {
      runInInjectionContext(this.params.injector, () => {
        objectEntries(this.params.config.controls).forEach(([key, config]) => {
          config?.hooks?.onDestroy && config?.hooks?.onDestroy(getFormForConfig(this.params.form, key) as any);
        });

        if (this.params.isRoot) {
          this.params.config?.hooks?.onDestroy && this.params.config?.hooks?.onDestroy(this.params.form);
        }
      });
    });
  }

  private getOnInitChangesFor(config: SubFormFieldConfig<Form> | FormGroupConfig<Form>, form: Form): Observable<void> {
    const onInitResult = runInInjectionContext(
      this.params.injector,
      () => config?.hooks?.onInit && config?.hooks.onInit(form as any),
    );

    const changes$ = isObservable(onInitResult) ? onInitResult : of(null);

    return changes$.pipe(
      distinctUntilChanged(isEqual),
      map(() => undefined),
    );
  }
}
