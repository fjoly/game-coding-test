import {GameRepositoryPort} from "../../core/domain/port/persistence/game.repository.port";
import {Game} from "../../core/domain/entities/game";
import {RemoveAndApplyDiscountGameCommand} from "./removeAndApplyDiscountGame.command";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {Inject} from "@nestjs/common";
import {GameProvider} from "../../core/domain/provider/game.provider";
const moment=require('moment-timezone')

@CommandHandler(RemoveAndApplyDiscountGameCommand)
export class RemoveAndApplyDiscountGameHandler implements ICommandHandler<RemoveAndApplyDiscountGameCommand> {
  
  constructor(
      @Inject(GameProvider.GameRepository)
      private readonly gameRepository: GameRepositoryPort,
  ) {}
  
  public async execute(command: RemoveAndApplyDiscountGameCommand): Promise<void> {
    const releaseDateOlderThan18 = moment().subtract(18, 'months').toDate();
    const releaseDateYoungerThan18 =moment().subtract(18, 'months').toDate();
    const releaseDateOlderThan12 = moment().subtract(12, 'months').toDate();
    const gamesOlderThan18Month: Game[] = await this.gameRepository.findGames({releaseDateOlderThan:releaseDateOlderThan18});
    const gamesBetween12And18Month: Game[] = await this.gameRepository.findGames({releaseDateOlderThan:releaseDateOlderThan12,releaseDateYoungerThan:releaseDateYoungerThan18});
    if (gamesOlderThan18Month !== undefined && gamesOlderThan18Month.length > 0) {
      await this.gameRepository.removeGames(gamesOlderThan18Month);
      console.log(gamesOlderThan18Month.length + " removed games ");
    }
    if(gamesBetween12And18Month !== undefined && gamesBetween12And18Month.length > 0){
      gamesBetween12And18Month.forEach(game => game.applyDiscount({percentage:20}));
      await this.gameRepository.updateGames(gamesBetween12And18Month);
      console.log(gamesBetween12And18Month.length + " discount apply on games ");
    }
  }
  
}
