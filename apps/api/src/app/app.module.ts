import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductModule } from "./product/product.module";
import { Product } from "./product/product.entity";
import { Order } from "./order/order.entity";
import { User } from "./user/user.entity";
import { OrderModule } from "./order/order.module";
import { UserModule } from "./user/user.module";
import { AddressModule } from "./address/address.module";
import { Address } from "./address/address.entity";
import { JwtModule } from "@nestjs/jwt";
import { EmailModule } from "./email/email.module";

const {
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_USERNAME,
    POSTGRES_PASSWORD,
    POSTGRES_DATABASE,
    JWT_SECRET
} = process.env;

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: POSTGRES_HOST,
            port: Number(POSTGRES_PORT),
            username: POSTGRES_USERNAME,
            password: POSTGRES_PASSWORD,
            database: POSTGRES_DATABASE,
            entities: [Product, Order, User, Address],
            ssl: true,
        }),
        ProductModule,
        OrderModule,
        UserModule,
        AddressModule,
        EmailModule,
        JwtModule.register({
            global: true,
            secret: JWT_SECRET,
            signOptions: { expiresIn: '1d' },
        })
    ],
})
export class AppModule {
}
