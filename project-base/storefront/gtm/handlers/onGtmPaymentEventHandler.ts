import { getGtmPaymentEvent } from 'gtm/factories/getGtmPaymentEvent';
import { gtmSafePushEvent } from 'gtm/utils/gtmSafePushEvent';

export const onGtmPaymentTryEventHandler = (
    paymentUuid: string,
    paymentType: string,
    isPaymentSuccessful?: boolean,
    paymentFalseReason?: string,
    paymentRetryCount: number = 0,
): void => {
    gtmSafePushEvent(
        getGtmPaymentEvent(
            paymentUuid,
            paymentType,
            isPaymentSuccessful === undefined ? true : isPaymentSuccessful,
            paymentRetryCount,
            paymentFalseReason,
        ),
    );
};
