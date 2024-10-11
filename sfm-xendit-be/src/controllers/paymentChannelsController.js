import axios from "axios";
import dotenv from "dotenv";
import { Xendit } from "xendit-node";

dotenv.config();

const api_key = process.env.XENDIT_API_KEY;

const xenditClient = new Xendit({ secretKey: api_key });
const { PaymentMethod, PaymentRequest } = xenditClient;

const paymentChannelsController = {
    list: async () => {
        try {
            console.log("🔥🔥🔥🔥🔥");
            const response = await PaymentMethod.getAllPaymentMethods();
            return response;
            // Log the list of available payment methods
            console.log("Available Payment Methods:", response);
        } catch (error) {
            console.error(
                "Error fetching payment methods:",
                error.response ? error.response.data : error.message
            );
        }
    },
    create: async (data) => {
        try {
            console.log("🔥🔥🔥🔥🔥");
            // const response = await PaymentMethod.getAllPaymentMethods();
            const response = await PaymentMethod.createPaymentMethod({
                data,
            });
            console.log("Payment Method Created:", response);
            return response;
            // Log the list of available payment methods
        } catch (error) {
            console.error("Error creating payment methods:", error);
            return error;
        }
    },
    expire: async (paymentMethodId) => {
        try {
            console.log("🔥🔥🔥🔥🔥");
            const response = await PaymentMethod.expirePaymentMethod({
                paymentMethodId,
            });
            console.log("Expiring Payment Methods:", response);
            return response;
            // Log the list of available payment methods
        } catch (error) {
            console.error(
                "Error expiring payment methods:",
                error.response ? error.response.data : error.message
            );
        }
    },
    updateStatus: async (data) => {
        try {
            console.log("🔥🔥🔥🔥🔥");
            // const response = await PaymentMethod.getAllPaymentMethods();
            const response = await PaymentMethod.patchPaymentMethod({
                data,
            });
            console.log("Payment Method Updated:", response);
            return response;
            // Log the list of available payment methods
        } catch (error) {
            console.error("Error updating payment methods:", error);
            return error;
        }
    },

    createEWalletCharge: async (data) => {
        try {
            console.log(
                "🔥🔥🔥🔥🔥 INITIATE PAYMENT EWALLET CHARGE 🔥🔥🔥🔥🔥"
            );

            const response = await PaymentRequest.createPaymentRequest({
                data,
            });

            console.log("Success creating Payment reques:", response);

            return response;
        } catch (e) {
            console.error(
                " 🔥🔥🔥🔥🔥 Error creating payment request charge: 🔥🔥🔥🔥🔥",
                e
            );
            return e;
        }
    },
};

export default paymentChannelsController;
