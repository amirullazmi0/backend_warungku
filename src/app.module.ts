import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CummonModule } from './cummon/cummon.module';
import { StoreModule } from './store/store.module';
import { ItemStoreModule } from './item-store/item-store.module';
import { RoleModule } from './role/role.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { TransactionModule } from './transaction/transaction.module';
import { AttachmentService } from './attachment/attachment.service';

@Module({
  imports: [UserModule, AuthModule, PrismaModule, CummonModule, StoreModule, ItemStoreModule, RoleModule, WishlistModule, TransactionModule],
  controllers: [],
  providers: [AttachmentService],
})
export class AppModule {}
