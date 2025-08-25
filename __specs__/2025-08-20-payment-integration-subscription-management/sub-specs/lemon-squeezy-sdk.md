[See](https://github.com/lmsqueezy/lemonsqueezy.js/wiki) for the full wiki.

This wiki page provides detailed information on function usage, including parameters, return values, and examples.

For the complete Lemon Squeezy API docs, please read the API introduction page to understand how the API works.

Only three functions (activateLicense,validateLicense, deactivateLicense) operate without requiring an API key. To use other functions, you must use lemonSqueezySetup to configure the apiKey before utilization.

For functions starting with get (getXXX functions), the parameters include a required id parameter and an optional params object parameter. The params object parameter includes an optional include property (an array of strings) to specify the related resources to include in the response.

For functions starting with list (listXXXs functions), the parameters include an optional params object parameter, which includes the optional filter, include, and page properties. For more information on how these three attributes are used, see the functions usage notes below.

For functions starting with create and update (createXXX and updateXXX functions), the parameters include a required id parameter and an information object for creating or updating.

For functions starting with cancel and delete (cancelXXX and deleteXXX methods), the parameter includes a required id parameter.

The function return value is an object containing three attributes: statusCode, error, and data. statusCode is the status code of the request, error may be a request error, response error, or null, and data is the response data from the Lemon Squeezy API.

Caution

Be sure to keep your API keys secure! Do not share your API keys in publicly accessible areas such as GitHub, client-side code, and so forth.

Functions Usage Setup lemonSqueezySetup - initialization configuration Users getAuthenticatedUser - retrieve the authenticated user Stores getStore - retrieve a store listStores - list all stores Customers createCustomer - create a customer updateCustomer - update a customer archiveCustomer - archive a customer getCustomer - retrieve a customer listCustomers - list all customers Products getProduct - retrieve a product listProducts - list all products Variants getVariant - retrieve a variant listVariants - list all variants Prices getPrice - retrieve a price listPrices - list all prices Files getFile - retrieve a file listFiles - list all files Orders getOrder - retrieve an order listOrders - list all orders generateOrderInvoice - generate order invoice issueOrderRefund - issue order refund Order Items getOrderItem - retrieve an order item listOrderItems - list all order items Subscriptions updateSubscription - update a subscription cancelSubscription - cancel a Subscription getSubscription - retrieve a subscription listSubscriptions - list all subscriptions Subscription Invoices getSubscriptionInvoice - retrieve a subscription invoice listSubscriptionInvoices - list all subscription invoices Subscription Items updateSubscriptionItem - update a subscription item getSubscriptionItem - retrieve a subscription item getSubscriptionItemCurrentUsage - retrieve a subscription item's current usage listSubscriptionItems - list all subscription items Usage Records createUsageRecord - create a usage record getUsageRecord - retrieve a usage record listUsageRecords - list all usage records Discounts createDiscount - create a discount deleteDiscount - delete a discount getDiscount - retrieve a discount listDiscounts - list all discounts Discount Redemptions getDiscountRedemption - retrieve a discount redemption listDiscountRedemptions - list all discount redemptions License Keys updateLicenseKey - update a license key getLicenseKey - retrieve a license key listLicenseKeys - list all license keys License Key Instances getLicenseKeyInstance - retrieve a license key instance listLicenseKeyInstances - list all license key instances Checkouts createCheckout - create a checkout getCheckout - retrieve a checkout listCheckouts - list all checkouts Webhooks createWebhook - create a webhook updateWebhook - update a webhook deleteWebhook - delete a webhook getWebhook - retrieve a webhook listWebhooks - list all webhooks License API The following three functions do not require the use of an api key.

ActivateLicense - activate a license key ValidateLicense - validate a license key DeactivateLicense - deactivate a license key
