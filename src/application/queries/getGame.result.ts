import {IQueryResult} from "@nestjs/cqrs";
import {Publisher} from "../../core/domain/entities/publisher";
import {GetPublisherResult} from "./getPublisher.result";

export class GetGameResult implements IQueryResult {
    readonly title: string = '';
    readonly price: number = null;
    readonly publisher: GetPublisherResult = null;
    readonly tags: string[] = [];
    readonly releaseDate: string = null;
}
