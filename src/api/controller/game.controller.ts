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
    ApiOperation, ApiResponse,
    ApiTags,
    ApiUnprocessableEntityResponse
} from "@nestjs/swagger";
import {CommandBus, QueryBus} from "@nestjs/cqrs";
import {CreateGameCommand} from "../../application/commands/createGame.command";
import {CoreApiResponse} from "../common/coreApi.response";
import {EditGameCommand} from "../../application/commands/editGame.command";
import {Exception} from "../../core/common/exception/Exception";
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
    @ApiBody({type: CreateGameCommand})
    @HttpCode(200)
    @ApiOperation({
        summary: 'Create a game in application',
        description: `Create and persist the game into the application`,
    })
    @ApiOkResponse({ description: 'Game successfully added' })
    @ApiUnprocessableEntityResponse({ description: 'Game verification code are in an invalid format.' })
    async createGame(@Body() createGameCommand: CreateGameCommand): Promise<CoreApiResponse<void>> {
        try
        {
            await this.commandBus.execute<CreateGameCommand>(createGameCommand);
            return CoreApiResponse.success(null,"Game successfully added");
        } catch (e) {
            if( e instanceof Exception){
                return CoreApiResponse.error(null, "Error creating game",e.data);
            }else {
                return CoreApiResponse.error(null, "Error creating game",e.toString());
            }
        }
    }

    @Post('/process')
    @HttpCode(200)
    @ApiOperation({
        summary: 'Process a command in application',
        description: `Process a command into the application`,
    })
    @ApiOkResponse({ description: 'Process successfully executed' })
    async triggerProcess(): Promise<CoreApiResponse<void>> {
      // try
      // {
            await this.commandBus.execute<RemoveAndApplyDiscountGameCommand>(new RemoveAndApplyDiscountGameCommand());
            return CoreApiResponse.success(null,"Process successfully executed");
       // } catch (e) {
       //     if( e instanceof Exception){
       //         return CoreApiResponse.error(null, "Error executing process",e.data);
       //     }else {
       //         return CoreApiResponse.error(null, "Error executing process",e.toString());
       //     }
       // }
    }

    @Put(':title')
    @ApiBody({type: EditGameHttpQuery})
    @HttpCode(200)
    @ApiOperation({
        summary: 'Update a game in application',
        description: `Update the game into the application`,
    })
    @ApiOkResponse({ description: 'Game successfully updated' })
    async editGame(@Param('title') title: string,@Body() editGameQuery: EditGameHttpQuery): Promise<CoreApiResponse<void>> {
        try
        {
            await this.commandBus.execute<EditGameCommand>(new EditGameCommand(
                title,
                editGameQuery.price,
                editGameQuery.publisher,
                editGameQuery.tags,
                editGameQuery.releaseDate));
            return CoreApiResponse.success(null,"Game successfully updated");
        } catch (e) {
            if( e instanceof Exception){
                return CoreApiResponse.error(null, "Error updating game",e.data);
            }else {
                return CoreApiResponse.error(null, "Error updating game",e.toString());
            }
         }

    }

    @Delete(':title')
    @HttpCode(200)
    @ApiOperation({
        summary: 'Delete a game in application',
        description: `Delete the game into the application`,
    })
    @ApiOkResponse({ description: 'Game successfully deleted' })
    async deleteGame(@Param('title') title: string): Promise<CoreApiResponse<void>> {
        try
        {
            await this.commandBus.execute<RemoveGameCommand>(new RemoveGameCommand(title));
            return CoreApiResponse.success(null,"Game successfully deleted");
        } catch (e) {
            if( e instanceof Exception){
                return CoreApiResponse.error(null, "Error deleting game",e.data);
            }else {
                return CoreApiResponse.error(null, "Error deleting game",e.toString());
            }
        }

    }

    @Get(':title')
    @HttpCode(200)
    @ApiOperation({
        summary: 'Get a game data store in application by is title',
        description: `Get a game data store in into the application by is title`,
    })
    @ApiResponse({status: HttpStatus.OK, type: CoreApiResponse})
    async getGame(@Param('title') title: string): Promise<CoreApiResponse<GetGameResult>> {
        try
        {
            const gameData:GetGameResult = await this.queryBus.execute<GetGameQuery>(new GetGameQuery(title));
            return CoreApiResponse.success(gameData,"Request successfully executed");
        } catch (e) {
            if( e instanceof Exception){
                return CoreApiResponse.error(null, "Error processing request",e.data);
            }else {
                return CoreApiResponse.error(null, "Error processing request",e.toString());
            }
        }

    }

    @Get()
    @HttpCode(200)
    @ApiOperation({
        summary: 'Get a game data store in application by is title',
        description: `Get a game data store in into the application by is title`,
    })
    @ApiResponse({status: HttpStatus.OK, type: CoreApiResponse})
    async getGames(@Query() query: GetGamesQuery): Promise<CoreApiResponse<GetGameResult[]>> {
       try
       {
            const gameData:GetGameResult[] = await this.queryBus.execute<GetGamesQuery>(new GetGamesQuery(
                query.tags,
                query.releaseDate,
                query.publisherName,
                query.publisherSiret,
                query.releaseDateOlderThan,
                query.releaseDateYoungerThan,
                query.options));
            return CoreApiResponse.success(gameData,"Request successfully executed");
       } catch (e) {
           if( e instanceof Exception){
               return CoreApiResponse.error(null, "Error processing request",e.data);
           }else {
               return CoreApiResponse.error(null, "Error processing request",e.toString());
           }
       }

    }

    @Get(':title/publisher')
    @HttpCode(200)
    @ApiOperation({
        summary: 'Get a publisher data store in application by title of the game',
        description: `Get a publisher data store in into the application by title of the game`,
    })
    @ApiResponse({status: HttpStatus.OK, type: CoreApiResponse})
    async getPublisher(@Param('title') title: string): Promise<CoreApiResponse<GetPublisherResult>> {
        try
        {
            const gameData:GetGameResult = await this.queryBus.execute<GetGameQuery>(new GetGameQuery(title));
            return CoreApiResponse.success(gameData?.publisher,"Request successfully executed");
        } catch (e) {
            if( e instanceof Exception){
                return CoreApiResponse.error(null, "Error processing request",e.data);
            }else {
                return CoreApiResponse.error(null, "Error processing request",e.toString());
            }
        }

    }
}