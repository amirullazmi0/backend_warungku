import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CummonModule } from './common/cummon.module';
import { AddressService } from './address/address.service';
import { AddressModule } from './address/address.module';

import { ItemStoreModule } from './item-store/item-store.module';
import { CartModule } from './cart/cart.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { StoreModule } from './store/store.module';
import { PaymentModule } from './payment/payment.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    PrismaModule,
    CummonModule,
    TransactionModule,
    AddressModule,
    ItemStoreModule,
    CartModule,
    WishlistModule,
    StoreModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [AddressService],
})
export class AppModule {}
