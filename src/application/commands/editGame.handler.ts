import {GameRepositoryPort} from "../../core/domain/port/persistence/game.repository.port";
import {Game} from "../../core/domain/entities/game";
import {EditGameCommand} from "./editGame.command";
import {Exception} from "../../core/common/exception/Exception";
import {Code} from "../../core/common/code/Code";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {Publisher} from "../../core/domain/entities/publisher";
import {Inject} from "@nestjs/common";
import {GameProvider} from "../../core/domain/provider/game.provider";

@CommandHandler(EditGameCommand)
export class EditGameHandler implements ICommandHandler<EditGameCommand>{
  
  constructor(
      @Inject(GameProvider.GameRepository)
      private readonly gameRepository: GameRepositoryPort,
  ) {}
  
  public async execute(command: EditGameCommand): Promise<void> {
    
    const game: Game = await this.gameRepository.findGame(command)
    if(game === undefined){
      throw Exception.new({code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: `${this.constructor.name}: this game does not exist`});
    }
    await game.edit({
      publisher: command.publisher,
      releaseDate: new Date(command.releaseDate),
      tags:command.tags,
      price:command.price
    });
    
    await this.gameRepository.updateGame(game);
  }
  
}
