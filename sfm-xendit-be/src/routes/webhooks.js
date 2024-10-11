import dotenv from "dotenv";

dotenv.config();

const webhook = (fastify, opts, next) => {
    fastify.route({
        method: "POST",
        url: "/webhook",
        // this function is executed for every request before the handler is executed
        preHandler: async (request, reply) => {
            const callbackToken = request.headers["x-callback-token"];

            // Validate X-CALLBACK-TOKEN
            if (callbackToken !== process.env.XENDIT_WEB_HOOK_TOKEN) {
                reply
                    .status(401)
                    .send({ error: "Unauthorized: Invalid X-CALLBACK-TOKEN" });
                return;
            }
        },
        handler: async (request, reply) => {
            try {
                const body = request.body;

                const { event } = body;

                switch (event) {
                    case "payment_session.completed":
                        return { msg: "Payment Completed" };
                    case "payment.succeeded":
                        return { msg: "Payment succeeded" };
                    case "payment.failed":
                        return { msg: "Payment failed" };
                    case "payment_session.expired":
                        return { msg: "Payment expired" };
                    default:
                        return { webhook: body };
                }
            } catch (e) {
                console.log(e);
            }
            return { error: true };
        },
    });

    next();
};

export default webhook;
