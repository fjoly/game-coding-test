import {GameRepositoryPort} from "../../core/domain/port/persistence/game.repository.port";
import {Game} from "../../core/domain/entities/game";
import {Exception} from "../../core/common/exception/Exception";
import {Code} from "../../core/common/code/Code";
import {RemoveGameCommand} from "./removeGame.command";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {Inject} from "@nestjs/common";
import {GameProvider} from "../../core/domain/provider/game.provider";

@CommandHandler(RemoveGameCommand)
export class RemoveGameHandler implements ICommandHandler<RemoveGameCommand>{
  
  constructor(
      @Inject(GameProvider.GameRepository)
      private readonly gameRepository: GameRepositoryPort,
  ) {}
  
  public async execute(command: RemoveGameCommand): Promise<void> {
    
    const game: Game = await this.gameRepository.findGame({title:command.title})
    if(game === undefined){
      throw Exception.new({code: Code.ENTITY_NOT_FOUND_ERROR, data: `${this.constructor.name}: this game does not exist`});
    }
    await this.gameRepository.removeGames(game);
    console.log("Game deleted : " + game.toString());
  }
  
}
