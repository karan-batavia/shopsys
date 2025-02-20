import { useAuthorization } from 'components/providers/AuthorizationProvider';
import { useDomainConfig } from 'components/providers/DomainConfigProvider';
import { TypeCartItemFragment } from 'graphql/requests/cart/fragments/CartItemFragment.generated';
import { useChangePaymentInOrderMutation } from 'graphql/requests/orders/mutations/ChangePaymentInOrderMutation.generated';
import { getGtmPaymentChangeEvent } from 'gtm/factories/getGtmPaymentChangeEvent';
import { onGtmPaymentTryEventHandler } from 'gtm/handlers/onGtmPaymentEventHandler';
import { mapGtmCartItemType } from 'gtm/mappers/mapGtmCartItemType';
import { gtmSafePushEvent } from 'gtm/utils/gtmSafePushEvent';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useIsUserLoggedIn } from 'utils/auth/useIsUserLoggedIn';
import { getInternationalizedStaticUrls } from 'utils/staticUrls/getInternationalizedStaticUrls';
import { showErrorMessage } from 'utils/toasts/showErrorMessage';
import { showSuccessMessage } from 'utils/toasts/showSuccessMessage';

export const useChangePaymentInOrder = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const isUserLoggedIn = useIsUserLoggedIn();
    const { url, currencyCode } = useDomainConfig();
    const { canSeePrices } = useAuthorization();
    const [orderByHashUrl, customerOrderDetailUrl] = getInternationalizedStaticUrls(
        [{ url: '/order-detail/:urlHash', param: '' }, '/customer/order-detail'],
        url,
    );

    const [{ fetching: isChangingPaymentInOrder }, changePaymentInOrder] = useChangePaymentInOrderMutation();

    const changePaymentInOrderHandler = async (
        orderUuid: string,
        paymentUuid: string,
        paymentType: string,
        paymentGoPayBankSwift?: string | null,
        withRedirectAfterChanging = true,
    ) => {
        const { data: changePaymentInOrderData } = await changePaymentInOrder({
            input: { orderUuid, paymentGoPayBankSwift: paymentGoPayBankSwift ?? null, paymentUuid },
        });
        const editedOrder = changePaymentInOrderData?.ChangePaymentInOrder;

        if (!editedOrder) {
            showErrorMessage(t('An error occurred while changing the payment'));

            return changePaymentInOrderData;
        }

        showSuccessMessage(t('Your payment has been successfully changed'));

        gtmSafePushEvent(
            getGtmPaymentChangeEvent(
                {
                    currencyCode: currencyCode,
                    products: editedOrder.productItems.map((product) =>
                        mapGtmCartItemType(product as unknown as TypeCartItemFragment, url),
                    ),
                    abandonedCartUrl: undefined,
                    valueWithoutVat: null,
                    valueWithVat: null,
                },
                editedOrder.payment,
                !canSeePrices,
            ),
        );

        if (!withRedirectAfterChanging) {
            return changePaymentInOrderData;
        }

        let redirectPromise: Promise<boolean>;

        if (isUserLoggedIn) {
            redirectPromise = router.push({
                pathname: customerOrderDetailUrl,
                query: { orderNumber: editedOrder.number },
            });
        } else {
            redirectPromise = router.push(orderByHashUrl + editedOrder.urlHash);
        }

        redirectPromise.then(() =>
            onGtmPaymentTryEventHandler(
                paymentUuid,
                paymentType,
                true,
                undefined,
                editedOrder.paymentTransactionsCount,
            ),
        );

        return changePaymentInOrderData;
    };

    return { changePaymentInOrderHandler, isChangePaymentInOrderFetching: isChangingPaymentInOrder };
};
