import Axios from "axios";
import { config } from "../config/config.js";

export async function generatePayment(data) {
    const response = await Axios({
        url: `${config.apiUrl}/payment-request/${data.type}/create`,
        method: "post",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        data,
    });

    return response;
}
