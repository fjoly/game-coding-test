export class GameProvider {

  // Repositories

  public static readonly GameRepository: unique symbol  = Symbol('GameRepository');
  public static readonly PublisherRepository: unique symbol  = Symbol('PublisherRepository');

}
