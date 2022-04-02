import { Module } from '@nestjs/common';
import {GameModule} from "./infrastructure/game.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {TypeOrmGameEntity} from "./infrastructure/adapter/persistence/typeorm/entity/typeOrmGame.entity";
import {TypeOrmPublisherEntity} from "./infrastructure/adapter/persistence/typeorm/entity/typeOrmPublisher.entity";

@Module({
  imports: [
      GameModule,
      TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'password',
          database: 'postgres',
          synchronize: true,
          autoLoadEntities: true,
      }),
  ],
})
export class RootModule {}
