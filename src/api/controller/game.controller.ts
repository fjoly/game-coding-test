import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode, HttpStatus,
    Param,
    Post,
    Put, Query,
} from "@nestjs/common";
import {
    ApiBody,
    ApiOkResponse,
    ApiOperation, ApiQuery, ApiResponse,
    ApiTags,
    ApiUnprocessableEntityResponse
} from "@nestjs/swagger";
import {CommandBus, QueryBus} from "@nestjs/cqrs";
import {CreateGameCommand} from "../../application/commands/createGame.command";
import {CoreApiResponse} from "../common/coreApi.response";
import {EditGameCommand} from "../../application/commands/editGame.command";
import {Exception} from "../../core/common/exception/exception";
import {RemoveGameCommand} from "../../application/commands/removeGame.command";
import {GetGameQuery} from "../../application/queries/getGame.query";
import {GetGameResult} from "../../application/queries/getGame.result";
import {GetPublisherResult} from "../../application/queries/getPublisher.result";
import {GetGamesQuery} from "../../application/queries/getGames.query";
import {EditGameHttpQuery} from "../query/editGame.http.query";
import {RemoveAndApplyDiscountGameCommand} from "../../application/commands/removeAndApplyDiscountGame.command";

@Controller('v1/games')
@ApiTags('Games')
export class GameController {

    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @Post()
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                title: { type: 'string' },
                price: { type: 'number'},
                publisher : {
                    properties: {
                        name: {type: 'string'},
                        siret: {type: 'number'},
                        phone: {type: 'string'},
                    }
                },
                tags : { type: 'array',
                    items: {
                        type: 'string',
                    },
                },
                releaseDate: {type: 'string'}
            }
        }
    })
    @HttpCode(200)
    @ApiOperation({
        summary: 'Create game',
        description: `Create and persist the game into the application`,
    })
    @ApiOkResponse({ description: 'Game successfully added' })
    async createGame(@Body() createGameCommand: CreateGameCommand): Promise<CoreApiResponse<GetGameResult>> {
        try
        {
            const gameData = await this.commandBus.execute<CreateGameCommand>(createGameCommand);
            return CoreApiResponse.success(gameData,"Game successfully added");
        } catch (e) {
            if( e instanceof Exception){
                return CoreApiResponse.error(e.code, "Error creating game",e.data);
            }else {
                return CoreApiResponse.error(null, "Error creating game",e.toString());
            }
        }
    }

    @Post('/process')
    @HttpCode(200)
    @ApiOperation({
        summary: 'Process a command',
        description: `Process a command RemoveAndApplyDiscountGameCommand into the application`,
    })
    @ApiOkResponse({ description: 'Process successfully executed' })
    async triggerProcess(): Promise<CoreApiResponse<void>> {
       try
       {
            await this.commandBus.execute<RemoveAndApplyDiscountGameCommand>(new RemoveAndApplyDiscountGameCommand());
            return CoreApiResponse.success(null,"Process successfully executed");
       } catch (e) {
            if( e instanceof Exception){
                return CoreApiResponse.error(e.code, "Error executing process",e.data);
            }else {
                return CoreApiResponse.error(null, "Error executing process",e.toString());
            }
       }
    }

    @Put(':slug')
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                title: { type: 'string' },
                price: { type: 'number'},
                publisher : {
                    properties: {
                        name: {type: 'string'},
                        siret: {type: 'number'},
                        phone: {type: 'string'},
                    }
                },
                tags : { type: 'array',
                    items: {
                        type: 'string',
                    },
                },
                releaseDate: {type: 'string'}
            }
        }
    })
    @HttpCode(200)
    @ApiOperation({
        summary: 'Update game',
        description: `Update the given game into the application`,
    })
    @ApiOkResponse({ description: 'Game successfully updated' })
    async editGame(@Param('slug') slug: string,@Body() editGameQuery: EditGameHttpQuery): Promise<CoreApiResponse<GetGameResult>> {
        try
        {
            const gameData = await this.commandBus.execute<EditGameCommand>(new EditGameCommand(
                slug,
                editGameQuery.title,
                editGameQuery.price,
                editGameQuery.publisher,
                editGameQuery.tags,
                editGameQuery.releaseDate));
            return CoreApiResponse.success(gameData,"Game successfully updated");
       } catch (e) {
           if( e instanceof Exception){
               return CoreApiResponse.error(e.code, "Error updating game",e.data);
           }else {
               return CoreApiResponse.error(null, "Error updating game",e.toString());
           }
       }

    }

    @Delete(':slug')
    @HttpCode(200)
    @ApiOperation({
        summary: 'Delete game',
        description: `Delete the given game into the application`,
    })
    @ApiOkResponse({ description: 'Game successfully deleted' })
    async deleteGame(@Param('slug') slug: string): Promise<CoreApiResponse<void>> {
        try
        {
            await this.commandBus.execute<RemoveGameCommand>(new RemoveGameCommand(slug));
            return CoreApiResponse.success(null,"Game successfully deleted");
        } catch (e) {
            if( e instanceof Exception){
                return CoreApiResponse.error(e.code, "Error deleting game",e.data);
            }else {
                return CoreApiResponse.error(null, "Error deleting game",e.toString());
            }
        }

    }

    @Get(':slug')
    @HttpCode(200)
    @ApiOperation({
        summary: 'Find game',
        description: `Find a game by is slug and return it`,
    })
    @ApiResponse({status: HttpStatus.OK, type: CoreApiResponse})
    async getGame(@Param('slug') slug: string): Promise<CoreApiResponse<GetGameResult>> {
        try
        {
            const gameData:GetGameResult = await this.queryBus.execute<GetGameQuery>(new GetGameQuery(slug));
            return CoreApiResponse.success(gameData,"Request successfully executed");
        } catch (e) {
            if( e instanceof Exception){
                return CoreApiResponse.error(e.code, "Error processing request",e.data);
            }else {
                return CoreApiResponse.error(null, "Error processing request",e.toString());
            }
        }

    }

    @Get()
    @ApiQuery({
        name:"queryFilter",
        schema: {
            type: "object",
            properties: {
                title: { type: 'string' },
                price: { type: 'number'},
                tags : { type: 'array',
                    items: {
                        type: 'string',
                    },
                },
                releaseDate: {type: 'string'},
                publisherName: { type: 'string'},
                publisherSiret: { type: 'number'},
                releaseDateOlderThan: { type: 'string'},
                releaseDateYoungerThan: { type: 'number'},
                options: {
                    properties: {
                        limit: {type: 'number'},
                        offset: {type: 'number'}
                    }
                },
            }
        }
    })
    @HttpCode(200)
    @ApiOperation({
        summary: 'Find games',
        description: `Find games data by title,tags,releaseDate,publisherName,publisherSiret,releaseDateOlderThan with options and return it`,
    })
    @ApiResponse({status: HttpStatus.OK, type: CoreApiResponse})
    async getGames(@Query() query: GetGamesQuery): Promise<CoreApiResponse<GetGameResult[]>> {
       try
       {
            const gameData:GetGameResult[] = await this.queryBus.execute<GetGamesQuery>(new GetGamesQuery(
                query.title,
                query.tags,
                query.price,
                query.releaseDate,
                query.publisherName,
                query.publisherSiret,
                query.releaseDateOlderThan,
                query.releaseDateYoungerThan,
                query.options));
            return CoreApiResponse.success(gameData,"Request successfully executed");
       } catch (e) {
           if( e instanceof Exception){
               return CoreApiResponse.error(e.code, "Error processing request",e.data);
           }else {
               return CoreApiResponse.error(null, "Error processing request",e.toString());
           }
       }

    }

    @Get(':slug/publisher')
    @HttpCode(200)
    @ApiOperation({
        summary: 'Get publisher data',
        description: `Find a game by is slug and return publisher data of the given game`,
    })
    @ApiResponse({status: HttpStatus.OK, type: CoreApiResponse})
    async getPublisher(@Param('slug') slug: string): Promise<CoreApiResponse<GetPublisherResult>> {
        try
        {
            const gameData:GetGameResult = await this.queryBus.execute<GetGameQuery>(new GetGameQuery(slug));
            return CoreApiResponse.success(gameData?.publisher,"Request successfully executed");
        } catch (e) {
            if( e instanceof Exception){
                return CoreApiResponse.error(e.code, "Error processing request",e.data);
            } else {
                return CoreApiResponse.error(null, "Error processing request",e.toString());
            }
        }

    }
}