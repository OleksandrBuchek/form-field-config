/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injector, Signal, WritableSignal, runInInjectionContext, signal } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { asyncScheduler, distinctUntilChanged, map, merge, Observable, of, shareReplay, skip, tap } from 'rxjs';

import { objectEntries } from '@shared/util-object';

import { FormFieldConfigStateType, FormGroupConfig, SubFormFieldConfig } from '../models';
import { getFormForConfig } from '../utils';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { isFactoryFunction } from '@shared/util-helpers';

interface StateChangeHandlerParams {
  control: AbstractControl;
  isStateActive: boolean;
  key?: PropertyKey;
}

type StateChangeHandler = (params: StateChangeHandlerParams) => void;

interface FormGroupStatesManagerParams<Form extends FormGroup> {
  injector: Injector;
  form: Form;
  config: FormGroupConfig<Form>;
  isRoot?: boolean;
}

type StatesMap<Form extends FormGroup> = Record<
  keyof Form['controls'],
  { value: Signal<boolean>; valueEmitter: WritableSignal<boolean> }
>;

export class FormGroupStatesManager<Form extends FormGroup> {
  readonly statesChanges$: Observable<void>;

  private readonly visibleStatesMap: StatesMap<Form>;
  private readonly disabledStatesMap: StatesMap<Form>;

  private readonly defaultValuesMap: Record<FormFieldConfigStateType, boolean> = {
    visible: true,
    disabled: false,
  };

  public readonly fieldsVisibilityMap: Record<keyof Form['controls'], Signal<boolean>>;

  constructor(private readonly params: Readonly<FormGroupStatesManagerParams<Form>>) {
    this.visibleStatesMap = this.getStatesMap(FormFieldConfigStateType.visible);
    this.disabledStatesMap = this.getStatesMap(FormFieldConfigStateType.disabled);
    this.fieldsVisibilityMap = this.getVisibilityMap();

    this.statesChanges$ = this.getStateChanges();
  }

  getDisabledState(key: keyof Form['controls']): boolean {
    return this.disabledStatesMap[key].value();
  }

  showField(key: keyof Form['controls']): void {
    this.visibleStatesMap[key].valueEmitter.set(true);
  }

  hideField(key: keyof Form['controls']): void {
    this.visibleStatesMap[key].valueEmitter.set(false);
  }

  enableField(key: keyof Form['controls']): void {
    this.disabledStatesMap[key].valueEmitter.set(false);
  }

  disableField(key: keyof Form['controls']): void {
    this.disabledStatesMap[key].valueEmitter.set(true);
  }

  private getVisibilityMap(): typeof this.fieldsVisibilityMap {
    return objectEntries(this.visibleStatesMap).reduce((acc, [key, { value }]) => {
      acc[key] = value;
      return acc;
    }, {} as typeof this.fieldsVisibilityMap);
  }

  private getStateChanges(): Observable<void> {
    const changes$ = [
      this.toggleControlOnStateChanges(this.visibleStatesMap, this.visibleStateHandler),
      this.toggleControlOnStateChanges(this.disabledStatesMap, this.disableStateHandler),
    ];

    if (this.params.isRoot) {
      changes$.push(this.toggleDisabledStateChangesForRoot());
    }

    return merge(...changes$);
  }

  private toggleControlOnStateChanges(
    statesMap: StatesMap<Form>,
    stateChangeHandler: StateChangeHandler,
  ): Observable<void> {
    const changes$ = objectEntries(statesMap).map(([key, { value }]) =>
      toObservable(value).pipe(
        tap((isStateActive) => {
          stateChangeHandler({ control: this.params.form.controls[key as string], isStateActive, key });
        }),
      ),
    );

    return merge(...changes$).pipe(map(() => undefined));
  }

  private disableStateHandler = ({ control, isStateActive: isDisabled }: StateChangeHandlerParams): void => {
    if (isDisabled && control.enabled) {
      asyncScheduler.schedule(() => {
        control.disable();
      });
    } else if (!isDisabled && control.disabled) {
      control.enable();
    }
  };

  private visibleStateHandler = ({ control, isStateActive: isVisible, key }: StateChangeHandlerParams): void => {
    const canBeEnabled = key ? this.disabledStatesMap[key as keyof Form['controls']].value() === false : true;

    if (isVisible && control.disabled && canBeEnabled) {
      control.enable();
    } else if (!isVisible) {
      asyncScheduler.schedule(() => {
        control.disable();
        control.reset();
      });
    }
  };

  private getStatesMap(stateType: FormFieldConfigStateType): StatesMap<Form> {
    return objectEntries(this.params.config.controls).reduce((acc, [key, config]) => {
      const valueEmitter = signal<boolean>(this.defaultValuesMap[stateType]);

      const changes$ = this.getStateChangesFor(config, getFormForConfig(this.params.form, key) as any, stateType);

      const value$ = merge(changes$, toObservable(valueEmitter).pipe(skip(1))).pipe(
        distinctUntilChanged(),
        shareReplay({ refCount: true, bufferSize: 1 }),
      );

      acc[key] = { value: toSignal(value$, { requireSync: true }), valueEmitter };

      return acc;
    }, {} as StatesMap<Form>);
  }

  private getStateChangesFor(
    config: SubFormFieldConfig<Form> | FormGroupConfig<Form>,
    form: Form,
    stateType: FormFieldConfigStateType,
  ): Observable<boolean> {
    const stateChangeFnOrBoolean = (config.states && config.states[stateType]) ?? this.defaultValuesMap[stateType];

    return runInInjectionContext(this.params.injector, () =>
      isFactoryFunction(stateChangeFnOrBoolean) ? stateChangeFnOrBoolean(form as any) : of(stateChangeFnOrBoolean),
    ).pipe(distinctUntilChanged());
  }

  private toggleDisabledStateChangesForRoot(): Observable<void> {
    return this.getStateChangesFor(this.params.config, this.params.form, FormFieldConfigStateType.disabled).pipe(
      tap((isDisabled) => {
        this.disableStateHandler({ control: this.params.form, isStateActive: isDisabled });
      }),
      map(() => undefined),
    );
  }
}
