import { ConsoleLogger, UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';
import { IamportService } from '../iamport/iamport.service';
import { Payment, PAYMENT_STATUS_ENUM } from './entities/payment.entity';
import { PaymentsService } from './payments.service';

@Resolver()
export class PaymentsResolver {
  constructor(
    private readonly paymentsService: PaymentsService, //
    private readonly iamportService: IamportService,
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment)
  async createPayment(
    @Args('impUid') impUid: string,
    @Args({ name: 'amount', type: () => Int }) amount: number,
    @Context() context: IContext,
  ) {
    const user = context.req.user;

    const paymentData = await this.iamportService.validateCreateInput({
      impUid,
      amount,
      user,
    });

    const payment = await this.paymentsService.create({
      impUid,
      amount,
      user,
      status: PAYMENT_STATUS_ENUM.PAID,
    });

    return payment;
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment)
  async cancelPayment(
    @Args('impUid') impUid: string,
    @Args({ name: 'amount', type: () => Int, nullable: true }) amount: number,
    @Context() context: IContext,
  ) {
    const user = context.req.user;

    const payments = await this.iamportService.validateCancelInput({
      impUid,
      amount,
      user,
    });

    const payment = await this.paymentsService.create({
      impUid,
      amount: -amount,
      user,
      status: PAYMENT_STATUS_ENUM.CANCELLED,
    });

    return payment;
  }
}
