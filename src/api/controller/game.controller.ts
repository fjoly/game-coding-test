import {Body, Controller, HttpCode, Patch, Post, UsePipes, ValidationPipe} from "@nestjs/common";
import {
    ApiBody,
    ApiConsumes,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnprocessableEntityResponse
} from "@nestjs/swagger";
import {CommandBus} from "@nestjs/cqrs";
import {CreateGameCommand} from "../../application/commands/createGame.command";
import {CoreApiResponse} from "../common/coreApi.response";

@Controller('v1/games')
@ApiTags('Games')
export class GameController {

    constructor(
        private readonly commandBus: CommandBus
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
    @UsePipes(new ValidationPipe({ transform: true }))
    async createGame(@Body() createGameCommand: CreateGameCommand): Promise<CoreApiResponse<void>> {
        try
        {
            await this.commandBus.execute<CreateGameCommand>(createGameCommand);
            return CoreApiResponse.success(null,"Game successfully added");
        } catch (e) {
            return CoreApiResponse.error(null, "Error creating game",e.toString());
        }

    }
}