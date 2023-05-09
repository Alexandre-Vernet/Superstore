import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { ProductModule } from './product/product.module';
import { HttpClientModule } from '@angular/common/http';
import { CartModule } from './cart/cart.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from "./auth/auth.module";

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
        HttpClientModule,
        SharedModule,
        ProductModule,
        CartModule,
        AuthModule
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
}
