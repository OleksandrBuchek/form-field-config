import { Signal } from '@angular/core';

export type AsSignals<T extends Record<string, string | number | Date | null | undefined>> = {
  [Key in keyof T]: Signal<T[Key]>;
};

export type WithSignals<T extends Record<string, string | number | Date | null | undefined>> = {
  [Key in keyof T]: T[Key] | Signal<T[Key]>;
};
