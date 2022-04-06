import { NestFactory } from '@nestjs/core';
import { RootModule } from './root.module';
import {ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(RootModule);
  app.useGlobalPipes(new ValidationPipe({transform:true}));
  //OpenApi documentation
  const config = new DocumentBuilder()
      .setTitle('Game')
      .setDescription('The game API description')
      .setVersion('1.0')
      .addTag('games')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
