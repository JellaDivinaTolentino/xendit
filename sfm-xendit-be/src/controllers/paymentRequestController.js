import axios from "axios";
import dotenv from "dotenv";
import { Xendit } from "xendit-node";

dotenv.config();

const api_key = process.env.XENDIT_API_KEY;

const xenditClient = new Xendit({ secretKey: api_key });
const { PaymentRequest, PaymentMethod } = xenditClient;

const paymentRequestController = {
    list: async () => {
        try {
            console.log("🔥🔥🔥🔥🔥");
            const response = await PaymentRequest.getAllPaymentRequests();
            console.log("Available Payment Request:", response);
            return response;
            // Log the list of available payment request
        } catch (error) {
            console.error(
                "Error fetching payment request:",
                error.response ? error.response.data : error.message
            );
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
            console.error("Error creating payment request charge:", e);
            return e;
        }
    },

    createCardCharge: async (data) => {
        try {
            console.log("🔥🔥🔥🔥🔥 INITIATE CARD PAYMENT 🔥🔥🔥🔥🔥");
            const response = await PaymentRequest.createPaymentRequest({
                data,
            });

            console.log("Payment Method Created:", response);

            return response;
        } catch (error) {
            console.error("Error creating payment methods:", error);
            return error;
        }
    },

    updatePaymentRequest: async (data) => {
        try {
            console.log("🔥🔥🔥🔥🔥 INITIATE CARD PAYMENT 🔥🔥🔥🔥🔥");
            const response = await PaymentMethod.patchPaymentMethod({
                data,
            });

            console.log("Payment Method Created:", response);

            return response;
        } catch (error) {
            console.error("Error creating payment methods:", error);
            return error;
        }
    },
};

export default paymentRequestController;
