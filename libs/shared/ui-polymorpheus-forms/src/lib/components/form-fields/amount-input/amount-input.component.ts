/* eslint-disable @angular-eslint/component-selector */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {
  injectPlaceholder,
  injectLabel,
  injectFieldControl,
  injectErrorMessages,
  injectHint,
  injectSuffixAndPrefix,
  injectTextAlignClassName,
  injectTemplateValidationParams,
} from '../../../injectors';
import { AsyncPipe, NgClass } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { toFixed } from '@shared/util-math';
import { NumberFieldFormControlConfigValidationParams } from '../../../models';
import { toMaxValidator, toMinValidator } from '@shared/util-forms';

@Component({
  selector: 'amount-input-field',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule, AsyncPipe, NgxMaskDirective, NgClass],
  templateUrl: './amount-input.component.html',
  styleUrls: ['./amount-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgxMask()],
})
export class AmountInputComponent<Form extends FormGroup, Key extends keyof Form['controls']> {
  readonly placeholder = injectPlaceholder<Form, Key>();
  readonly label = injectLabel<Form, Key>();
  readonly control = injectFieldControl<Form, Key>();
  readonly errorMessages$ = injectErrorMessages<Form, Key>();
  readonly hint = injectHint<Form, Key>();
  readonly suffixAndPrefix = injectSuffixAndPrefix<Form, Key>();
  readonly textAlignClassName = injectTextAlignClassName<Form, Key>();
  readonly validationParams = injectTemplateValidationParams<Form, Key, NumberFieldFormControlConfigValidationParams>();

  readonly maskPattern = `separator.2`;
  readonly toFixed = toFixed(2);

  constructor() {
    this.initValidators();
  }

  public onFocused() {
    this.clearZeroValue();
  }

  private initValidators(): void {
    this.control.addValidators([toMaxValidator(this.validationParams.max), toMinValidator(this.validationParams.min)]);
  }

  private clearZeroValue(): void {
    if (this.control.value === 0) {
      this.control.setValue(null, { emitEvent: false });
    }
  }
}
