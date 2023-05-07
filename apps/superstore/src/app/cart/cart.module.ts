import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';
import { ViewCartComponent } from './view-cart/view-cart.component';
import { FormsModule } from '@angular/forms';
import { CheckoutComponent } from "./checkout/checkout.component";

@NgModule({
    declarations: [
        CartComponent,
        ViewCartComponent,
        CheckoutComponent
    ],
    imports: [
        CommonModule,
        CartRoutingModule,
        FormsModule
    ],
})
export class CartModule {
}
