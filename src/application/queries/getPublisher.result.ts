import {IQueryResult} from "@nestjs/cqrs";
import {Publisher} from "../../core/domain/entities/publisher";
import {IsNumber, IsString} from "class-validator";

export class GetPublisherResult implements IQueryResult {
    readonly slug: string = '';
    readonly name: string = '';
    readonly siret: number = null;
    readonly phone: string = '';
}