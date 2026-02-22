import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { BookingsModule } from './bookings/bookings.module';
import { AuthMiddleware } from './auth.middleware';

@Module({
  imports: [BookingsModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'bookings', method: RequestMethod.POST });
  }
}