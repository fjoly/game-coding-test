import { Module } from '@nestjs/common';
import {GameModule} from "./infrastructure/game.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
      ConfigModule.forRoot({
          envFilePath: `env/${process.env.NODE_ENV}.app.env`,
          isGlobal: true,
      }),
      GameModule,
      TypeOrmModule.forRoot({
          type: "postgres",
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT, 10) || 5432,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          synchronize: true,
          autoLoadEntities: true,
      }),
  ],
})
export class RootModule {}
