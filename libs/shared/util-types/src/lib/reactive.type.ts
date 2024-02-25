import { Signal } from '@angular/core';
import { Observable } from 'rxjs';

export type ValueOrReactive<TValue> = TValue | Observable<TValue> | Signal<TValue>;
