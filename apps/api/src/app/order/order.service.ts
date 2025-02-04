import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { OrderEntity } from './order.entity';
import { OrderDto, OrderState } from '@superstore/interfaces';
import { AddressService } from '../address/address.service';
import Stripe from 'stripe';

@Injectable()
export class OrderService {

    stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
        private readonly addressService: AddressService
    ) {
    }

    async createPaymentIntent(amount: number, confirmPayment: boolean) {
        const amountInCents = Math.round(amount * 100);

        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'eur',
            // eslint-disable-next-line camelcase
            payment_method: 'pm_card_visa',
            // eslint-disable-next-line camelcase
            automatic_payment_methods: {
                enabled: true,
                // eslint-disable-next-line camelcase
                allow_redirects: 'never'
            },
            confirm: confirmPayment
        });

        return { paymentIntent };
    }

    async create(order: OrderDto) {
        const amount = order.products.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

        const { paymentIntent } = await this.createPaymentIntent(amount, true);

        if (paymentIntent.status !== 'succeeded') {
            throw new HttpException({
                message: 'Payment failed'
            }, HttpStatus.CONFLICT);
        } else {
            order.address = await this.addressService.create(order.address, false);
            return await this.orderRepository.save(order);
        }
    }

    findAll(): Promise<OrderEntity[]> {
        // Order by id ASC
        const options: FindManyOptions = {
            order: { id: 'ASC' }
        };

        return this.orderRepository.find(options);
    }

    async updateOrderState(id: number, updateOrderDto: OrderState) {
        await this.orderRepository.update(id, { state: updateOrderDto });
        return this.orderRepository.findOne({
            where: { id }
        });
    }

    remove(id: number) {
        return this.orderRepository.delete(id);
    }

    getLastOrder(userId: number) {
        const options: FindOneOptions = {
            where: {
                user: {
                    id: userId
                }
            },
            order: { createdAt: 'DESC' }
        };
        return this.orderRepository.findOne(options);
    }

    getUserOrders(userId: number) {
        const options: FindManyOptions = {
            where: {
                user: {
                    id: userId
                }
            },
            order: {
                createdAt: 'DESC',
                products: {
                    product: {
                        images: {
                            id: 'ASC'
                        }
                    }
                }
            },
            relations: ['products', 'products.product', 'products.product.images']
        };
        return this.orderRepository.find(options);
    }

    async userCanAddReview(productId: number, userId: number): Promise<boolean> {
        const result = await this.orderRepository.createQueryBuilder('order')
            .innerJoin('order.products', 'orderProduct')
            .innerJoin('orderProduct.product', 'product')
            .leftJoin('product.reviews', 'review', 'review.user.id = :userId', { userId })
            .where('order.user.id = :userId', { userId })
            .andWhere('product.id = :productId', { productId })
            .andWhere('review.id IS NULL') // No review from the user
            .getCount();

        // User can add a review if he has ordered the product and has not reviewed it yet
        return result > 0;
    }
}
