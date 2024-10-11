import paymentRequestController from "../controllers/paymentRequestController.js";

const paymentRequest = (fastify, opts, next) => {
    fastify.route({
        method: "GET",
        url: "/payment-request",
        schema: {
            // request needs to have a querystring with a `name` parameter
            // querystring: {
            //     type: "object",
            //     properties: {
            //         name: { type: "string" },
            //     },
            //     required: ["name"],
            // },
            // the response needs to be an object with an `hello` property of type 'string'
            response: {
                // 200: {
                //     type: "object",
                //     properties: {
                //         hello: { type: "string" },
                //     },
                // },
            },
        },
        // this function is executed for every request before the handler is executed
        preHandler: async (request, reply) => {
            // E.g. check authentication
        },
        handler: async (request, reply) => {
            try {
                const response = await paymentRequestController.list();
                return response;
            } catch (e) {
                console.log(e);
            }
            return { error: true };
        },
    });
    fastify.route({
        method: "POST",
        url: "/payment-request/gcash/create",
        schema: {
            body: {
                type: "object",
                properties: {
                    skuId: { type: "string" },
                    referenceId: { type: "string" },
                    customerId: { type: "string" },
                    firstName: { type: "string" },
                    lastName: { type: "string" },
                    amount: { type: "number" },
                    description: { type: "string" },
                    items: { type: "array" },
                    successReturnUrl: { type: "string" },
                    failureReturnUrl: { type: "string" },
                },
                required: [
                    "skuId",
                    "referenceId",
                    "customerId",
                    "firstName",
                    "lastName",
                    "amount",
                    "successReturnUrl",
                    "failureReturnUrl",
                ],
            },
        },
        // this function is executed for every request before the handler is executed
        preHandler: async (request, reply) => {
            // E.g. check authentication
        },
        handler: async (request, reply) => {
            const { method } = request.params;
            const {
                skuId,
                referenceId,
                customerId,
                firstName,
                lastName,
                amount,
                description = "",
                items = [],
                successReturnUrl,
                failureReturnUrl,
            } = request.body;

            try {
                let response =
                    await paymentRequestController.createEWalletCharge({
                        country: "PH",
                        amount,
                        referenceId,
                        description,
                        items,
                        metadata: {
                            skuId,
                            customer: {
                                customerId,
                                firstName,
                                lastName,
                            },
                        },
                        paymentMethod: {
                            ewallet: {
                                channelProperties: {
                                    successReturnUrl,
                                    failureReturnUrl,
                                },
                                channelCode: "GCASH",
                            },
                            reusability: "ONE_TIME_USE",
                            type: "EWALLET",
                        },
                        currency: "PHP",
                    });
                return response;
            } catch (e) {
                console.log(e);
            }
            return { error: true };
        },
    });

    fastify.route({
        method: "POST",
        url: "/payment-request/card/create",
        schema: {
            body: {
                type: "object",
                properties: {
                    skuId: { type: "string" },
                    referenceId: { type: "string" },
                    customerId: { type: "string" },
                    amount: { type: "number" },
                    description: { type: "string" },
                    items: { type: "array" },

                    cardNumber: { type: "string" },
                    expiryMonth: { type: "string" },
                    expiryYear: { type: "string" },
                    cvv: { type: "string" },
                    cardholder_name: { type: "string" },
                    cardholder_name: { type: "string" },
                    successReturnUrl: { type: "string" },
                    failureReturnUrl: { type: "string" },
                },
                required: [
                    "skuId",
                    "referenceId",
                    "customerId",
                    "amount",
                    "cardNumber",
                    "expiryMonth",
                    "expiryYear",
                    "cvv",
                    "cardholderName",
                    "successReturnUrl",
                    "failureReturnUrl",
                ],
            },
        },
        // this function is executed for every request before the handler is executed
        preHandler: async (request, reply) => {
            // E.g. check authentication
        },
        handler: async (request, reply) => {
            const { method } = request.params;
            const {
                skuId,
                referenceId,
                customerId,
                cardNumber,
                expiryMonth,
                expiryYear,
                cvv,
                cardholderName,
                amount,
                description = "",
                items = [],
                successReturnUrl,
                failureReturnUrl,
            } = request.body;

            try {
                let response = await paymentRequestController.createCardCharge({
                    currency: "PHP",
                    amount,
                    paymentMethod: {
                        type: "CARD",
                        card: {
                            currency: "PHP",
                            channelProperties: {
                                successReturnUrl,
                                failureReturnUrl,
                            },
                            cardInformation: {
                                cardNumber,
                                expiryMonth,
                                expiryYear,
                                cvv,
                                cardholderName,
                                country: "PH",
                            },
                        },
                        reusability: "ONE_TIME_USE",
                        description,
                    },
                    metadata: {
                        skuId,
                        customer: {
                            customerId,
                            cardholderName,
                        },
                    },
                    items,
                });
                return response;
            } catch (e) {
                console.log(e);
            }
            return { error: true };
        },
    });

    next();
};

export default paymentRequest;
