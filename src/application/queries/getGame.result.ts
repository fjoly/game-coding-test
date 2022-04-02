import {IQueryResult} from "@nestjs/cqrs";
import {IsArray, IsDate, IsInstance, IsNumber, IsString} from "class-validator";
import {Publisher} from "../../core/domain/entities/publisher";

export class GetGameResult implements IQueryResult {
    readonly title: string = '';
    readonly price: number = null;
    readonly publisher: Publisher = null;
    readonly tags: string[] = [];
    readonly releaseDate: Date = null;
}
