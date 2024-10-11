import Fastify from "fastify";
import paymentChannels from "./src/routes/paymentChannels.js";
import paymentRequest from "./src/routes/paymentRequest.js";
import webhooks from "./src/routes/webhooks.js";
import fastifyCors from "@fastify/cors";

const fastify = Fastify({
    logger: true,
});

fastify.register(paymentChannels);
fastify.register(paymentRequest);
fastify.register(webhooks);

fastify.register(fastifyCors, {
    origin: "*",
});

try {
    await fastify.listen({ port: 3000 });
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}
