import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CummonModule } from './cummon/cummon.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { TransactionModule } from './transaction/transaction.module';
import { AddressService } from './address/address.service';
import { AddressModule } from './address/address.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    PrismaModule,
    CummonModule,
    WishlistModule,
    TransactionModule,
    AddressModule,
  ],
  controllers: [],
  providers: [AddressService],
})
export class AppModule {}
