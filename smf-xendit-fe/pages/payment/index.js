import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "../../services/api";
import { config } from "../../services/config/config.js";

export default function Home() {
    const [methods] = useState(["Credit Card", "GCash"]);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showError, setError] = useState("");
    const [form, setForm] = useState({
        skuId: "",
        referenceId: "",
        customerId: "",
        amount: 0,
        firstName: "",
        lastName: "",
        email: "",
        title: "",
        description: "",
        image: "",
        cardNumber: "",
        cardholderName: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: "",
        data: {},
    });
    const [isLoading, setLoading] = useState(false);

    const searchParams = useSearchParams();

    useEffect(() => {
        const amount = searchParams.get("amount");
        const firstName = searchParams.get("firstName");
        const lastName = searchParams.get("lastName");
        const email = searchParams.get("email");
        const skuId = searchParams.get("skuId");
        const referenceId = searchParams.get("referenceId");
        const customerId = searchParams.get("customerId");
        const title = searchParams.get("title");
        const description = searchParams.get("description");
        const image = searchParams.get("image");
        const cForm = { ...form };
        if (amount) {
            cForm.amount = amount;
        }

        if (firstName) {
            cForm.firstName = firstName;
        }
        if (lastName) {
            cForm.lastName = lastName;
        }
        if (email) {
            cForm.email = email;
        }
        if (skuId) {
            cForm.skuId = skuId;
        }
        if (referenceId) {
            cForm.referenceId = referenceId;
        }
        if (customerId) {
            cForm.customerId = customerId;
        }
        if (title) {
            cForm.title = title;
        }
        if (description) {
            cForm.description = description;
        }
        if (image) {
            cForm.image = image;
        }

        setForm(cForm);
    }, [searchParams]);

    function handleSelectMethod(m) {
        setError("");
        if (isLoading) return;
        setSelectedMethod(m);
    }

    function closeError() {
        setError("");
    }

    async function handleSubmit() {
        setError("");
        setLoading(true);
        const request = {
            skuId: form.skuId,
            referenceId: form.referenceId,
            customerId: form.customerId,
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            amount: form.amount,
            title: form.title,
            description: form.description,
            image: form.image,
            successReturnUrl: config.successReturnUrl,
            failureReturnUrl: config.failureReturnUrl,
        };

        let finalRequest = {};

        switch (selectedMethod) {
            case "GCash":
                finalRequest = { ...request, type: "gcash" };
                break;

            case "Credit Card":
                finalRequest = {
                    ...request,
                    type: "card",
                    cardNumber: form.cardNumber.replace(/\s/g, ""),
                    cardholderName: form.cardholderName,
                    expiryMonth: form.expiryMonth,
                    expiryYear: 20 + String(form.expiryYear),
                    cvv: form.cvv,
                };
                break;

            default:
                break;
        }
        try {
            const response = await api.payment.generatePayment(finalRequest);

            console.log({ response });

            if (response?.status === 200) {
                setLoading(false);
                if (
                    response?.data?.status === 400 ||
                    response?.data?.status === 500
                ) {
                    setError(response?.data?.errorMessage);
                } else if (response?.data?.error_code) {
                    setError(response?.data?.message);
                } else {
                    const actions = response?.data?.actions;

                    const action = actions.find((f) => f.urlType === "WEB");
                    if (action) {
                        window.location = action?.url;
                    }
                }
            }
        } catch (e) {
            setLoading(false);
            setError(e?.response?.data?.message);
            return e;
        }

        // setLoading(false);
        // Submit
    }

    function handleProceed() {
        setShowForm(true);
    }

    function formatCardNumber(input) {
        let value = input.target.value.replace(/\D/g, "");
        input.target.value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    }

    function restrictMonthInput(input) {
        input.target.value = input.target.value.replace(/\D/g, "");
        if (input.target.value > 12) {
            input.target.value = "12";
        }
    }

    function restrictYearInput(input) {
        // Remove any non-digit characters
        input.target.value = input.target.value.replace(/\D/g, "");
    }

    return (
        <div className="p-4">
            {isLoading ? (
                <div className="w-full h-full absolute top-0 left-0 bg-gray-700/70 text-center z-9">
                    <img
                        width="250"
                        className="block text-center ml-auto mr-auto mt-64"
                        src={`/assets/images/loading.gif`}
                    />
                    <button
                        type="button"
                        className="text-white text-xl mt-2"
                        disabled
                    >
                        <svg
                            className="animate-spin h-5 w-5 text-white inline mr-2 align-text-bottom"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                width="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        Processing...
                    </button>
                </div>
            ) : (
                ""
            )}
            <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-2 mt-5 xl:divide-x lg:divide-x md:divide-x">
                <div className="xl:p-10 lg:p-10 md:p-10 sm:p-12">
                    <img width="120" src={`/assets/images/serye-fm-logo.png`} />
                    <label className="block mt-5">{form.title}</label>
                    <label className="text-3xl">
                        ₱ {parseFloat(form.amount).toFixed(2)}
                    </label>
                    <label className="block mt-5">{form.description}</label>
                    <img
                        width="200"
                        height="200"
                        className="mt-10"
                        src={form.image}
                    />
                </div>
                <div className="xl:p-10 lg:p-10 md:p-10 sm:p-12">
                    <div className="flex flex-col justify-center">
                        {!showForm ? (
                            <div className="flex flex-col gap-2 mb-8 sm:mt-10">
                                <label className="block">
                                    {form.firstName} {form.lastName}
                                </label>
                                <hr className="mt-5 mb-5" />
                                <label className="block mb-3">
                                    Payment Method
                                </label>
                                {showError || showError != "" ? (
                                    <div
                                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative z-0 capitalize"
                                        role="alert"
                                    >
                                        <strong className="font-bold">
                                            Error!
                                        </strong>
                                        <br />
                                        <span className="block sm:inline">
                                            {showError}
                                        </span>
                                        <span
                                            className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
                                            onClick={() => closeError()}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                width="1.5"
                                                stroke="currentColor"
                                                className="size-6"
                                            >
                                                <path d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                        </span>
                                    </div>
                                ) : (
                                    ""
                                )}

                                {methods.map((m, i) => (
                                    <div
                                        key={i}
                                        className={`rounded border-2 border-inherit p-2 w-full hover:bg-yellow-300 ${
                                            selectedMethod === m
                                                ? "bg-yellow-300"
                                                : ""
                                        } hover:text-black cursor-pointer `}
                                        onClick={() => handleSelectMethod(m)}
                                    >
                                        <img
                                            width="40"
                                            className="inline mr-2"
                                            src={`/assets/images/${m
                                                .replace(/ /g, "-")
                                                .toLowerCase()}-icon.png`}
                                        />
                                        {m}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 mb-8 sm:mt-10">
                                <label className="block">
                                    {form.firstName} {form.lastName}
                                </label>
                                <hr className="mt-5 mb-5" />
                                {showError || showError != "" ? (
                                    <div
                                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative z-0"
                                        role="alert"
                                    >
                                        <strong className="font-bold">
                                            Error!
                                        </strong>
                                        <br />
                                        <span className="block sm:inline">
                                            {showError}
                                        </span>
                                        <span
                                            className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
                                            onClick={() => closeError()}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                width="1.5"
                                                stroke="currentColor"
                                                className="size-6"
                                            >
                                                <path d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                        </span>
                                    </div>
                                ) : (
                                    ""
                                )}
                                <div className="grid grid-cols-1 gap-2">
                                    <div>
                                        <label className="block">Email</label>
                                        <input
                                            type="text"
                                            value={form.email}
                                            className="rounded border-2 p-2 w-full"
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    email: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block">
                                            Card Number
                                        </label>
                                        <input
                                            type="text"
                                            value={form.cardNumber}
                                            className="rounded border-2 p-2 w-full"
                                            maxLength="19"
                                            placeholder="xxxx xxxx xxxx xxxx"
                                            onInput={(e) => formatCardNumber(e)}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    cardNumber: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block">
                                            Card Holder Name
                                        </label>
                                        <input
                                            type="text"
                                            value={form.cardholderName}
                                            className="rounded border-2 p-2 w-full"
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    cardholderName:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <label className="block">
                                            Expiry Month
                                        </label>
                                        <input
                                            type="text"
                                            value={form.expiryMonth}
                                            maxLength="2"
                                            className="rounded border-2 p-2 w-full"
                                            placeholder="MM"
                                            onInput={(e) =>
                                                restrictMonthInput(e)
                                            }
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    expiryMonth: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block">
                                            Expiry Year
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="YY"
                                            value={form.expiryYear}
                                            maxLength="2"
                                            className="rounded border-2 p-2 w-full"
                                            onInput={(e) =>
                                                restrictYearInput(e)
                                            }
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    expiryYear: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block">CVV</label>
                                        <input
                                            type="number"
                                            value={form.cvv}
                                            min="1"
                                            max="12"
                                            className="rounded border-2 p-2 w-full"
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    cvv: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {showForm && (
                            <button
                                type="button"
                                className={`rounded bg-gray-900 text-white py-2 px-5 mb-2 
                            }`}
                                onClick={() => {
                                    setShowForm(false);
                                }}
                            >
                                Back
                            </button>
                        )}
                        <button
                            type="button"
                            className={`rounded bg-blue-500 text-white py-2 px-5 ${
                                isLoading || selectedMethod === null
                                    ? "disabled disabled:bg-gray-200"
                                    : ""
                            }`}
                            onClick={
                                showForm ||
                                !["Credit Card"].includes(selectedMethod)
                                    ? handleSubmit
                                    : handleProceed
                            }
                            disabled={isLoading || selectedMethod === null}
                        >
                            {showForm ||
                            !["Credit Card"].includes(selectedMethod)
                                ? "Submit"
                                : "Proceed"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
