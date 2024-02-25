import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PersonInfoForm } from '../../person-info';
import { DeepRequired } from '@shared/util-types';
import { Country } from './countries.api';

export type DoctorDetails = DeepRequired<PersonInfoForm['value']>;

const getDoctorsListMock = (): DoctorDetails[] => [
  {
    firstName: 'John',
    lastName: 'Doe',
    address: {
      addressLine1: '123 Main St',
      addressLine2: null,
      zip: '12345',
      country: Country.Netherlands,
    },
  },
  {
    firstName: 'Alice',
    lastName: 'Smith',
    address: {
      addressLine1: '456 Elm St',
      addressLine2: 'Apt 2B',
      zip: '67890',
      country: Country.NewZeland,
    },
  },
  {
    firstName: 'Bob',
    lastName: 'Johnson',
    address: {
      addressLine1: '789 Oak St',
      addressLine2: null,
      zip: '23456',
      country: Country.Ukraine,
    },
  },
  {
    firstName: 'Emily',
    lastName: 'Brown',
    address: {
      addressLine1: '101 Pine St',
      addressLine2: 'Suite 5C',
      zip: '54321',
      country: Country.UnitedKingdom,
    },
  },
  {
    firstName: 'Michael',
    lastName: 'Wilson',
    address: {
      addressLine1: '222 Cedar St',
      addressLine2: null,
      zip: '13579',
      country: Country.Poland,
    },
  },
  {
    firstName: 'Sarah',
    lastName: 'Clark',
    address: {
      addressLine1: '333 Birch St',
      addressLine2: 'Unit 7D',
      zip: '97531',
      country: Country.USA,
    },
  },
  {
    firstName: 'David',
    lastName: 'Lee',
    address: {
      addressLine1: '444 Maple St',
      addressLine2: null,
      zip: '24680',
      country: Country.USA,
    },
  },
  {
    firstName: 'Jessica',
    lastName: 'White',
    address: {
      addressLine1: '555 Walnut St',
      addressLine2: 'Apt 3A',
      zip: '86420',
      country: Country.USA,
    },
  },
  {
    firstName: 'Christopher',
    lastName: 'Hall',
    address: {
      addressLine1: '666 Pineapple St',
      addressLine2: null,
      zip: '11223',
      country: Country.USA,
    },
  },
  {
    firstName: 'Olivia',
    lastName: 'Baker',
    address: {
      addressLine1: '777 Orange St',
      addressLine2: 'Suite 9E',
      zip: '33445',
      country: Country.USA,
    },
  },
];

@Injectable({
  providedIn: 'root',
})
export class DoctorsApi {
  private readonly doctorsListSubject$ = new BehaviorSubject<DoctorDetails[]>([]);

  readonly doctorsList$ = this.doctorsListSubject$.asObservable();

  fetchDoctorsList(): void {
    this.doctorsListSubject$.next(getDoctorsListMock());
  }
}
