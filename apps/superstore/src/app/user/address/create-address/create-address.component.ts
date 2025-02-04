import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddressDto } from '@superstore/interfaces';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddressService } from '../address.service';
import { AuthService } from '../../../auth/auth.service';
import { distinctUntilChanged, map, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
    selector: 'superstore-address',
    templateUrl: './create-address.component.html',
    styleUrls: ['./create-address.component.scss']
})
export class CreateAddressComponent implements OnInit, OnDestroy {

    addresses: AddressDto[] = [];
    formAddress = new FormGroup({
        id: new FormControl(),
        company: new FormControl(),
        address: new FormControl('', [Validators.required]),
        apartment: new FormControl(),
        country: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required]),
        phone: new FormControl('', [Validators.required])
    });

    buttonAddAddress$ = new Subject<void>();
    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly addressService: AddressService,
        private readonly authService: AuthService
    ) {
    }

    ngOnInit() {
        this.addressService.addresses$.subscribe((addresses) => this.addresses = addresses);


        this.buttonAddAddress$.pipe(
            distinctUntilChanged(),
            takeUntil(this.unsubscribe$),
            map(() => this.formAddress.value),
            switchMap((address) => {
                    const addressDto: AddressDto = {
                        user: this.authService.user,
                        company: address.company ? address.company.trim() : null,
                        address: address.address.trim(),
                        apartment: address.apartment ? address.apartment.trim() : null,
                        country: address.country.trim(),
                        city: address.city.trim(),
                        zipCode: address.zipCode,
                        phone: address.phone
                    };

                    if (this.formAddress.get('id')?.value) {
                        this.clearFormAddress();
                        return this.addressService.updateAddress({
                            id: this.formAddress.get('id').value,
                            ...addressDto
                        });
                    } else {
                        this.clearFormAddress();
                        return this.addressService.createAddress(addressDto);
                    }

                }
            )
        )
            .subscribe({
                error: (err) => {
                    this.formAddress.setErrors({ [err.error.field ?? 'address']: err.error.message });
                }
            });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    selectAddress(address: AddressDto | null) {
        if (!address) {
            this.clearFormAddress();
            return;
        }
        this.formAddress.patchValue({
            id: address.id,
            company: address?.company,
            address: address.address,
            apartment: address?.apartment,
            country: address.country,
            city: address.city,
            zipCode: address.zipCode,
            phone: address.phone
        });
    }

    clearFormAddress() {
        this.formAddress.reset();
    }
}
