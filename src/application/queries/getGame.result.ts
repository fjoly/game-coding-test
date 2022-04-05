import {IQueryResult} from "@nestjs/cqrs";
import {GetPublisherResult} from "./getPublisher.result";

export class GetGameResult implements IQueryResult {
    readonly slug: string = '';
    readonly title: string = '';
    readonly price: number = null;
    readonly publisher: GetPublisherResult = null;
    readonly tags: string[] = [];
    readonly releaseDate: string = null;
}
