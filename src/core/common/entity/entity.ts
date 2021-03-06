import {ClassValidationDetails, ClassValidator} from "../utils/class-validator/class.validator";
import {Optional} from "../type/common.types";
import {Exception} from "../exception/exception";
import {Code} from "../code/code";

export class Entity<TIdentifier extends string|number> {
  
  protected id: Optional<TIdentifier>;
  
  public getId(): TIdentifier {
    if (typeof this.id === 'undefined') {
      throw Exception.new({code: Code.ENTITY_VALIDATION_ERROR, data: `${this.constructor.name}: ID is empty.`});
    }
    return this.id;
  }
  
  public async validate(): Promise<void> {
    const details: Optional<ClassValidationDetails> = await ClassValidator.validate(this);
    if (details) {
      throw Exception.new({code: Code.ENTITY_VALIDATION_ERROR, data: details});
    }
  }
  
}
