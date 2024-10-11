import paymentChannelsController from "../controllers/paymentChannelsController.js";

const paymentChannels = (fastify, opts, next) => {
    fastify.route({
        method: "GET",
        url: "/payment-channels",
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
                const response = await paymentChannelsController.list();
                return response;
            } catch (e) {
                console.log(e);
            }
            return { error: true };
        },
    });
    fastify.route({
        method: "POST",
        url: "/payment-channels/gcash/create",
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
                const data = {
                    ewallet: {
                        channelProperties: {
                            failureReturnUrl: "https://redirect.me/failure",
                            successReturnUrl: "https://redirect.me/success",
                            cancelReturnUrl: "https://redirect.me/cancel",
                        },
                        channelCode: "GCASH",
                    },
                    metadata: {
                        sku: "example-1234",
                    },
                    reusability: "ONE_TIME_USE",
                    type: "EWALLET",
                    customer: {
                        type: "INDIVIDUAL",
                        referenceId: "customer-123",
                        individualDetail: {
                            surname: "Doe",
                            givenNames: "John",
                        },
                    },
                };
                const response = await paymentChannelsController.create(data);
                return response;
            } catch (e) {
                console.log(e);
            }
            return { error: true };
        },
    });
    fastify.route({
        method: "get",
        url: "/payment-channels/:id/expire",
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
                const { id } = request.params;
                const response = await paymentChannelsController.expire(id);
                return response;
            } catch (e) {
                console.log(e);
            }
            // const { name } = request.query;
            // const { id } = request.params;
            return { error: true };
        },
    });
    next();
};

export default paymentChannels;
