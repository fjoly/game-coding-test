import {IQueryResult} from "@nestjs/cqrs";

export class GetPublisherResult implements IQueryResult {
    readonly slug: string = '';
    readonly name: string = '';
    readonly siret: number = null;
    readonly phone: string = '';
}