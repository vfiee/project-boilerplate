import { Module } from '@nestjs/common';
import { AppMiddlewareModule } from 'src/app/app.middleware.module';
import { CommonModule } from 'src/common/common.module';
import { RouterModule } from 'src/router/router.module';
import { WorkerModule } from 'src/worker/worker.module';

@Module({
    controllers: [],
    providers: [],
    imports: [
        // Common
        CommonModule,
        AppMiddlewareModule,

        // Routes
        RouterModule,

        // Workers
        WorkerModule,
    ],
})
export class AppModule { }
