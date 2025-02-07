import { user } from 'fixtures/demodata';
import { checktHeadlineText } from 'support';
import { TIDs } from 'tids';

type RoutesForSmokeTestsType = {
    skip?: boolean;
    logged?: boolean;
    test?: null | (() => void);
    loginCredentials?: {
        email: string;
        password: string;
    };
    params?: {
        [key: string]: string;
    };
};

context('Smoke tests', () => {
    const { routes } = require('/config/routes');
    const translatedRoutes = routes[0];
    const projectPages = Cypress.env('projectPages');

    const filteredRoutes: Record<string, RoutesForSmokeTestsType> = {
        // static routes
        ['/api/health']: { skip: true },
        ['/customer/change-password']: {
            skip: false,
            logged: true,
            test: () => {
                checktHeadlineText('Change password');
            },
        },
        ['/customer/complaint-detail']: { skip: true },
        ['/customer/complaints']: {
            skip: false,
            logged: true,
            test: () => {
                checktHeadlineText('My complaints');
            },
        },
        ['/customer/edit-profile']: {
            skip: false,
            logged: true,
            test: () => {
                checktHeadlineText('Edit profile');
            },
        },
        ['/customer/new-complaint']: {
            skip: false,
            logged: true,
            test: () => {
                checktHeadlineText('New complaint');
            },
        },
        ['/customer/order-detail']: { skip: true },
        ['/customer/orders']: {
            skip: false,
            logged: true,
            test: () => {
                checktHeadlineText('My orders');
            },
        },
        ['/customer/users']: { skip: true },
        ['/order/contact-information']: { skip: true }, // TODO add test
        ['/order/payment-status-notify']: { skip: true }, // TODO add test
        ['/order/transport-and-payment']: { skip: true }, // TODO add test
        ['/order-detail/:urlHash']: { skip: true },
        ['/brands-overview']: {
            skip: false,
            test: () => {
                cy.getByTID([[TIDs.blocks_simplenavigation_, 0]]).should('be.visible');
            },
        },
        ['/cart']: { skip: true }, // TODO add test
        ['/contact-form']: {
            skip: false,
            test: () => {
                checktHeadlineText('Write to us');
            },
        },
        ['/grapesjs-template']: {
            skip: false,
            test: () => {
                checktHeadlineText('Blog or Article title');
            },
        },
        ['/']: {
            skip: false,
            test: () => {
                cy.getByTID([TIDs.header]).should('be.visible');
            },
        },
        ['/login']: {
            skip: false,
            test: () => {
                cy.getByTID([TIDs.login_form_submit_button]).should('be.visible');
            },
        },
        ['/new-password']: { skip: true }, // TODO add test
        ['/order-confirmation']: { skip: true }, // TODO add test
        ['/order-payment-confirmation']: { skip: true }, // TODO add test
        ['/personal-data-export']: {
            skip: false,
            test: () => {
                checktHeadlineText('Personal data export');
            },
        },
        ['/personal-data-overview']: {
            skip: false,
            test: () => {
                checktHeadlineText('Personal data overview');
            },
        },
        ['/product-comparison']: {
            skip: false,
            test: () => {
                checktHeadlineText('Product comparison');
            },
        },
        ['/registration']: {
            skip: false,
            test: () => {
                checktHeadlineText('New customer registration');
            },
        },
        ['/reset-password']: {
            skip: false,
            test: () => {
                checktHeadlineText('Forgotten password');
            },
        },
        ['/search']: {
            skip: false,
            params: { ['q']: 'television' },
            test: () => {
                checktHeadlineText('Search results for "television"');
            },
        },
        ['/social-login']: { skip: true },
        ['/stores']: {
            skip: false,
            test: () => {
                checktHeadlineText('Stores');
            },
        },
        ['/styleguide']: { skip: true },
        ['/user-consent']: {
            skip: false,
            test: () => {
                checktHeadlineText('User consent');
            },
        },
        ['/wishlist']: {
            skip: false,
            test: () => {
                checktHeadlineText('Wishlist');
            },
        },

        // // dynamic routes
        ['/abandoned-cart/:cartUuid']: { skip: true },
        ['/articles/:articleSlug']: { skip: true },
        ['/blogArticles/:blogArticleSlug']: { skip: true },
        ['/blogCategories/:blogCategorySlug']: { skip: true },
        ['/brands/:brandSlug']: { skip: true },
        ['/categories/:categorySlug']: { skip: true },
        ['/flags/:flagSlug']: { skip: true },
        ['/personal-data-overview/:hash']: { skip: true },
        ['/products/:productSlug']: { skip: true },
        ['/stores/:storeSlug']: { skip: true },

        // custom routes
        ['/electronics']: {
            skip: false,
            logged: false,
            test: () => {
                checktHeadlineText('Electronic devices');
            },
        },
        ['/television-22-sencor-sle-22f46dm4-hello-kitty-plasma']: {
            skip: false,
            logged: false,
            test: () => {
                checktHeadlineText('22" Sencor SLE 22F46DM4 HELLO KITTY plasma');
            },
        },
        ['/about-us']: {
            skip: false,
            logged: false,
            test: () => {
                checktHeadlineText('About us');
            },
        },
        ['/main-blog-page-en']: {
            skip: false,
            logged: false,
            test: () => {
                checktHeadlineText('Main blog page - en');
            },
        },
        ['/blog-article-example-1-en']: {
            skip: false,
            logged: false,
            test: () => {
                checktHeadlineText('Blog article example 1 en - H1');
            },
        },
        ['/apple']: {
            skip: false,
            logged: false,
            test: () => {
                checktHeadlineText('Apple SEO H1');
            },
        },
        ['/action']: {
            skip: false,
            logged: false,
            test: () => {
                checktHeadlineText('Action');
            },
        },
        ['/ostrava']: {
            skip: false,
            logged: false,
            test: () => {
                checktHeadlineText('Ostrava');
            },
        },
    };

    const routesToCheck = Array.from(new Set([...projectPages, ...Object.keys(filteredRoutes)]));

    routesToCheck.forEach((routeName) => {
        const testConfig = filteredRoutes[routeName];
        const checkRouteCyFn = testConfig?.skip ? it.skip : it;

        checkRouteCyFn(`💨 Smoke test - ${routeName}`, () => {
            const isCustomRoute = routeName in filteredRoutes;

            if (isCustomRoute && filteredRoutes[routeName].logged) {
                cy.login(user.email, user.password);
            }

            let routeToRequest = (translatedRoutes[routeName as keyof typeof translatedRoutes] ?? routeName) as string;

            const customParameters = filteredRoutes[routeName].params;

            if (isCustomRoute && customParameters) {
                Object.keys(customParameters).forEach((parameterKey) => {
                    if (routeToRequest.includes(parameterKey)) {
                        routeToRequest = routeToRequest.replace(`:${parameterKey}`, customParameters[parameterKey]);
                    } else {
                        const searchParams = new URLSearchParams(filteredRoutes[routeName].params);
                        routeToRequest = `${routeToRequest}?${searchParams.toString()}`;
                    }
                });
            }

            cy.visit({ url: routeToRequest, failOnStatusCode: true }).then(() => {
                cy.get('#__NEXT_DATA__').should('exist');
                cy.getByTID([TIDs.error_page]).should('not.exist');

                if (isCustomRoute && filteredRoutes[routeName].test) {
                    filteredRoutes[routeName].test?.();
                }
            });
        });
    });
});
