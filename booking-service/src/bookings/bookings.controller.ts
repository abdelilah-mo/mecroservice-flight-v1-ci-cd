import { Controller, Post, Body, Req } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() body: any, @Req() req: any) {
    const userId = req.user.userId;
    return this.bookingsService.create(userId, body.flightId);
  }
}