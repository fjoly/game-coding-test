import {ICommand} from "@nestjs/cqrs";

export class RemoveAndApplyDiscountGameCommand implements ICommand {

  constructor(
      public readonly percentage: number,
      public readonly dateReleaseStartDiscount: Date,
      public readonly dateReleaseEndDiscount: Date,
      public readonly dateRemoveOlderGame: Date,
  ) {}

}