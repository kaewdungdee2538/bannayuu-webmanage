import { Module } from '@nestjs/common';
import { EstampByHomeController } from './estamp-by-home.controller';
import { EstampByHomeService } from './estamp-by-home.service';

@Module({
  controllers: [EstampByHomeController],
  providers: [EstampByHomeService]
})
export class EstampByHomeModule {}
