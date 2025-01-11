import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CummonModule } from './common/cummon.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { TransactionModule } from './transaction/transaction.module';
import { AddressService } from './address/address.service';
import { AddressModule } from './address/address.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    PrismaModule,
    CummonModule,
    WishlistModule,
    TransactionModule,
    AddressModule,
    CartModule,
  ],
  controllers: [],
  providers: [AddressService],
})
export class AppModule {}
