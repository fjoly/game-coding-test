import {GameRepositoryPort} from "../../core/domain/port/persistence/game.repository.port";
import {CreateGameCommand} from "./createGame.command";
import {Game} from "../../core/domain/entities/game";
import {Exception} from "../../core/common/exception/Exception";
import {Code} from "../../core/common/code/Code";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {Publisher} from "../../core/domain/entities/publisher";
import {Inject} from "@nestjs/common";
import {GameProvider} from "../../core/domain/provider/game.provider";

@CommandHandler(CreateGameCommand)
export class CreateGameHandler implements ICommandHandler<CreateGameCommand> {
  
  constructor(
      @Inject(GameProvider.GameRepository)
      private readonly gameRepository: GameRepositoryPort,
  ) {}
  
  async execute(command: CreateGameCommand): Promise<void> {

    const gameAlreadyExist: Game = await this.gameRepository.findGame(command)

    if( gameAlreadyExist !== undefined ){
      throw Exception.new({code: Code.ENTITY_ALREADY_EXISTS_ERROR, overrideMessage: `${this.constructor.name}: this title game already exist`});
    }

    const game: Game = await Game.new({
      id:null,
      title: command.title,
      price: command.price,
      publisher: command.publisher,
      tags: command.tags,
      releaseDate: new Date(command.releaseDate),
    });
    
    await this.gameRepository.addGame(game);
  }
  
}
