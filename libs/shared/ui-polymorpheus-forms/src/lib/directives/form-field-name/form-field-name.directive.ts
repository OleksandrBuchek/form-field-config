/* eslint-disable @angular-eslint/directive-selector */
import { Attribute, Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive({
  standalone: true,
  selector: '[formFieldName]',
})
export class FormFieldNameDirective<Form extends FormGroup, Key extends keyof Form['controls']> {
  constructor(@Attribute('formFieldName') readonly name: Key) {}
}
