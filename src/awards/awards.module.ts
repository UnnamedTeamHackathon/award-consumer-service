import { Module } from '@nestjs/common';
import { AwardsService } from './awards.service';
import { AwardsController } from './awards.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [AwardsService],
  controllers: [AwardsController],
  imports: [PrismaModule],
  exports: [AwardsService],
})
export class AwardsModule {}
