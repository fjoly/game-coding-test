import {Module, Provider} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {TypeOrmGameEntity} from "./adapter/persistence/typeorm/entity/typeOrmGame.entity";
import {TypeOrmPublisherEntity} from "./adapter/persistence/typeorm/entity/typeOrmPublisher.entity";
import {GameController} from "../api/controller/game.controller";
import {CqrsModule} from "@nestjs/cqrs";
import {TypeOrmGameRepositoryAdapter} from "./adapter/persistence/typeorm/repository/typeOrmGame.repository.adapter";
import {CreateGameHandler} from "../application/commands/createGame.handler";
import {EditGameHandler} from "../application/commands/editGame.handler";
import {RemoveAndApplyDiscountGameHandler} from "../application/commands/removeAndApplyDiscountGame.handler";
import {RemoveGameHandler} from "../application/commands/removeGame.handler";
import {GetGamesHandler} from "../application/queries/getGames.handler";
import {GetGameHandler} from "../application/queries/getGame.handler";
import {GameProvider} from "../core/domain/provider/game.provider";

export const CommandHandlers = [CreateGameHandler, EditGameHandler,RemoveAndApplyDiscountGameHandler,RemoveGameHandler];
export const QueryHandlers = [GetGamesHandler, GetGameHandler];

const AdapterProviders: Provider[] = [
  {
    provide : GameProvider.GameRepository,
    useClass: TypeOrmGameRepositoryAdapter,
  },
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      TypeOrmGameEntity,
      TypeOrmPublisherEntity,
    ]),
  ],
  controllers: [GameController],
  providers: [
      ...AdapterProviders,
      ...CommandHandlers,
      ...QueryHandlers,
  ],
})
export class GameModule {}
