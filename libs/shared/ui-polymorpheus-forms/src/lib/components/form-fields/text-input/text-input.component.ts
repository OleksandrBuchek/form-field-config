/* eslint-disable @angular-eslint/component-selector */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {
  injectPlaceholder,
  injectLabel,
  injectFieldControl,
  injectErrorMessages,
  injectTemplateValidationParams,
  injectInputTypeAttribute,
  injectAutofocus,
  injectExtra,
  injectHint,
  injectSuffixAndPrefix,
  injectAutocomplete,
} from '../../../injectors';
import { AsyncPipe } from '@angular/common';
import { TextFieldFormControlConfigValidationParams } from '../../../models';
import { AutofocusDirective } from '../../../directives';

@Component({
  selector: 'text-input-field',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule, AsyncPipe, AutofocusDirective],
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInputComponent<Form extends FormGroup, Key extends keyof Form['controls']> {
  readonly placeholder = injectPlaceholder<Form, Key>();
  readonly autocomplete = injectAutocomplete<Form, Key>();
  readonly label = injectLabel<Form, Key>();
  readonly control = injectFieldControl<Form, Key>();
  readonly errorMessages$ = injectErrorMessages<Form, Key>();
  readonly validationParams = injectTemplateValidationParams<Form, Key, TextFieldFormControlConfigValidationParams>();
  readonly inputType = injectInputTypeAttribute();
  readonly autofocus = injectAutofocus();
  readonly extra = injectExtra();
  readonly hint = injectHint<Form, Key>();
  readonly suffixAndPrefix = injectSuffixAndPrefix<Form, Key>();
}
