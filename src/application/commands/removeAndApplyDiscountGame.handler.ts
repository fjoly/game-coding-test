import {GameRepositoryPort} from "../../core/domain/port/persistence/game.repository.port";
import {Game} from "../../core/domain/entities/game";
import {RemoveAndApplyDiscountGameCommand} from "./removeAndApplyDiscountGame.command";
import {Exception} from "../../core/common/exception/Exception";
import {Code} from "../../core/common/code/Code";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {Inject} from "@nestjs/common";
import {GameProvider} from "../../core/domain/provider/game.provider";

@CommandHandler(RemoveAndApplyDiscountGameCommand)
export class RemoveAndApplyDiscountGameHandler implements ICommandHandler<RemoveAndApplyDiscountGameCommand> {
  
  constructor(
      @Inject(GameProvider.GameRepository)
      private readonly gameRepository: GameRepositoryPort,
  ) {}
  
  public async execute(command: RemoveAndApplyDiscountGameCommand): Promise<void> {

    const game: Game[] = await this.gameRepository.findGames({});
    //TODO
  }
  
}
