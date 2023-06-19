import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService] // to allow service to be used outside a module. You must give it permission. 
})
export class PrismaModule {}

// Global -> allows you to use prisma service in any module