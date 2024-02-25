import { FormGroup } from '@angular/forms';
import { injectControlConfig } from './control-config.injector';
import { Observable, isObservable, of } from 'rxjs';

export const injectLabel = <Form extends FormGroup, Key extends keyof Form['controls']>(): Observable<string> => {
  const label = injectControlConfig<Form, Key>().label;

  return isObservable(label) ? label : of(label);
};
