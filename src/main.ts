import './instrument';

import { Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestApplication, NestFactory } from '@nestjs/core';
import { plainToInstance } from 'class-transformer';
import { useContainer, validate } from 'class-validator';
import compression from 'compression';
import { NextFunction, Request } from 'express';
import { Logger as PinoLogger } from 'nestjs-pino';
import { AppModule } from 'src/app/app.module';
import { AppEnvDto } from 'src/app/dtos/app.env.dto';
import { MessageService } from 'src/common/message/services/message.service';
import swaggerInit from 'src/swagger';

async function bootstrap() {
    const app: NestApplication = await NestFactory.create(AppModule, {
        abortOnError: true,
        bufferLogs: false,
    });

    const configService = app.get(ConfigService);
    const databaseUri: string = configService.get<string>('database.url');
    const env: string = configService.get<string>('app.env');
    const timezone: string = configService.get<string>('app.timezone');
    const host: string = configService.get<string>('app.http.host');
    const port: number = configService.get<number>('app.http.port');
    const globalPrefix: string = configService.get<string>('app.globalPrefix');
    const versioningPrefix: string = configService.get<string>(
        'app.urlVersion.prefix'
    );
    const version: string = configService.get<string>('app.urlVersion.version');

    // enable
    const versionEnable: string = configService.get<string>(
        'app.urlVersion.enable'
    );

    const logger = new Logger('NestJs-Main');
    process.env.NODE_ENV = env;
    process.env.TZ = timezone;

    // logger
    app.useLogger(app.get(PinoLogger));

    // Compression
    app.use(compression());

    // Global
    app.setGlobalPrefix(globalPrefix);

    // For Custom Validation
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    // Versioning
    if (versionEnable) {
        app.enableVersioning({
            type: VersioningType.URI,
            defaultVersion: version,
            prefix: versioningPrefix,
        });
    }

    // Validate Env
    const errors = await validate(plainToInstance(AppEnvDto, process.env));
    if (errors.length > 0) {
        const messageService = app.get(MessageService);
        const errorsMessage = messageService.setValidationMessage(errors);

        throw new Error('Env Variable Invalid', { cause: errorsMessage });
    }

    // Swagger
    await swaggerInit(app);

    // set response for log
    app.use(function (_: Request, res: any, next: NextFunction) {
        const send = res.send;
        res.send = function (body: any) {
            res.body = body;
            send.call(this, body);
        };
        next();
    });

    // Listen
    await app.listen(port, host);

    logger.log(`Http versioning is ${versionEnable ? 'enabled' : 'disabled'}`);

    logger.log(
        `Http Server running on ${await app.getUrl()}`,
        'NestApplication'
    );
    logger.log(`Database uri ${databaseUri}`);

    return;
}
bootstrap();
