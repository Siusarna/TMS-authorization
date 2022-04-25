import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from "./config";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot(config.db),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
