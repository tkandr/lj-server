import 'dotenv/config';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { validationOptions, ResolvePromisesInterceptor } from './utils';
import { IAppConfig, IAllAppConfig } from '@lj/config';
import { useContainer } from 'class-validator';

const docsPath: string = <const>'docs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true, // Native parser for application/json and application/x-www-form-urlencoded.
    rawBody: true, // Raw body for native parser.
    bufferLogs: true,
    ...(process.env.NODE_ENV !== 'development'
      ? null
      : { cors: { origin: '*', credentials: true } }),
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const configService = app.get(ConfigService<IAllAppConfig>);
  const appConfig: IAppConfig = configService.getOrThrow('app', {
    infer: true,
  });

  app.enableShutdownHooks();

  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'],
    },
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(new ValidationPipe(validationOptions));

  app.useGlobalInterceptors(
    // ResolvePromisesInterceptor is used to resolve promises in responses because class-transformer can't do it
    // https://github.com/typestack/class-transformer/issues/549
    new ResolvePromisesInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(docsPath, app, document);

  await app.listen(appConfig.port, appConfig.host);

  const url: string = await app.getUrl();
  const logger: Logger = new Logger(`Bootstrap`);

  logger.log(`🚀 Application is running on: ${url}`);
  logger.log(`🚀 Swagger is running on: ${url}/${docsPath}`);
}
bootstrap();
