import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { FlightsModule } from './flights/flights.module';
import { AuthMiddleware } from './auth.middleware';

@Module({
  imports: [FlightsModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'flights', method: RequestMethod.POST },
        { path: 'flights/:id', method: RequestMethod.PUT },
        { path: 'flights/:id', method: RequestMethod.DELETE },
      );
  }
}