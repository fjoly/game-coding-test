import {GetPublisherResult} from "../queries/getPublisher.result";
import {Publisher} from "../../core/domain/entities/publisher";

export class PublisherMapper {
    static toPublisherResult(publisher: Publisher): GetPublisherResult {
        if(publisher === undefined){
            return undefined;
        }
        return {
            slug: publisher.getSlug(),
            name: publisher.getName(),
            siret: publisher.getSiret(),
            phone: publisher.getPhone(),
        } as GetPublisherResult;
    }

    static toPublisherResultCollection(publishers: Publisher[]): GetPublisherResult[] {
        return publishers.map((c) => this.toPublisherResult(c));
    }
}