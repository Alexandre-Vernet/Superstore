import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';
import { ViewCartComponent } from './view-cart/view-cart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckoutComponent } from './checkout/checkout.component';
import { SharedModule } from '../shared/shared.module';
import { ConfirmOrderComponent } from "../order/confirm-order/confirm-order.component";
import { OptionalAuthGuard } from "../auth/optional-auth.guard";
import { AddressModule } from '../address/address.module';

@NgModule({
    declarations: [
        CartComponent,
        ViewCartComponent,
        CheckoutComponent,
        ConfirmOrderComponent,
    ],
    imports: [
        CommonModule,
        CartRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        AddressModule
    ],
    providers: [OptionalAuthGuard]
})
export class CartModule {
}
