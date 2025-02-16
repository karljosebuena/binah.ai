import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongodbConfig } from './config/mongodb.config';
import { SampleModule } from './modules/sample/sample.module';
import { TestResultModule } from './modules/test-result/test-result.module';
import { ErrorHandlingMiddleware } from './presentation/http/middlewares/error-handling.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useClass: MongodbConfig,
    }),
    SampleModule,
    TestResultModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ErrorHandlingMiddleware).forRoutes('*');
  }
}
