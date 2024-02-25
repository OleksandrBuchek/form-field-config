import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Country = (typeof Country)[keyof typeof Country];

export const Country = {
  Ukraine: 'Ukraine',
  UnitedKingdom: 'The United Kingdom',
  USA: 'USA',
  Netherlands: 'The Netherlands',
  Poland: 'Poland',
  NewZeland: 'New Zeland',
} as const;

const COUNTRIES: Country[] = ['Ukraine', 'The United Kingdom', 'USA', 'The Netherlands', 'Poland', 'New Zeland'];

@Injectable({
  providedIn: 'root',
})
export class CountriesApi {
  private readonly countriesSubject$ = new BehaviorSubject<Country[]>([]);

  readonly countries$ = this.countriesSubject$.asObservable();

  fetchCountries(): void {
    this.countriesSubject$.next(COUNTRIES);
  }
}
