import { Module } from '@nestjs/common';
import {GameModule} from "./infrastructure/game.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
      ConfigModule.forRoot({
          envFilePath: `env/local.app.env`,
          isGlobal: true,
      }),
      GameModule,
      TypeOrmModule.forRoot({
          type: "postgres",
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          synchronize: true,
          autoLoadEntities: true,
      }),
  ],
})
export class RootModule {}
