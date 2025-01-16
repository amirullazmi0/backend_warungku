import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { apiPayment } from 'src/common/url';

@Controller(`${apiPayment}`)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    const paymentResponse = await this.paymentService.create(createPaymentDto);
    return paymentResponse;
  }

  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Patch('/update-status')
  async updateStatus(
    @Body() updatePaymentStatusDto: CreatePaymentDto,
    @Headers('authorization') authHeader: string,
  ) {
    return this.paymentService.updateStatus(authHeader, updatePaymentStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
