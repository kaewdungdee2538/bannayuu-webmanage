import { Module } from '@nestjs/common';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import { WorkflowPaymentController } from './workflow-payment.controller';
import { WorkflowPaymentService } from './workflow-payment.service';

@Module({
  controllers: [WorkflowPaymentController],
  providers: [WorkflowPaymentService, dbConnection, FormatDataUtils, ErrMessageUtilsTH]
})
export class WorkflowPaymentModule {}
