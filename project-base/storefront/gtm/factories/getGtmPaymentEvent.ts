import { GtmEventType } from 'gtm/enums/GtmEventType';
import { GtmPaymentEventType } from 'gtm/types/events';

export const getGtmPaymentEvent = (
    paymentUuid: string,
    paymentType: string,
    isPaymentSuccessful: boolean,
    paymentRetryCount: number,
    paymentFalseReason?: string,
): GtmPaymentEventType => ({
    event: GtmEventType.payment,
    ecommerce: {
        id: paymentUuid,
        isPaymentSuccessful,
        paymentRetryCount,
        PaymentFalseReason: paymentFalseReason,
        paymentType,
    },
    _clear: true,
});
