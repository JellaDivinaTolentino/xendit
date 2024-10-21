import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "../../services/api";

export default function Home() {
    const [methods] = useState(["Credit Card", "GCash"]);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [showForm, setShowForm] = useState(false);
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
        if (isLoading) return;
        setSelectedMethod(m);
    }

    async function handleSubmit() {
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
            successReturnUrl: "https://redirect.me/success",
            failureReturnUrl: "https://redirect.me/fail",
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
                    cardNumber: form.cardNumber,
                    cardholderName: form.cardholderName,
                    expiryMonth: form.expiryMonth,
                    expiryYear: form.expiryYear,
                    cvv: form.cvv,
                };
                break;

            default:
                break;
        }
        const response = await api.payment.generatePayment(finalRequest);

        console.log({ response });

        if (response?.status === 200) {
            const actions = response?.data?.actions;

            const action = actions.find((f) => f.urlType === "WEB");
            if (action) {
                window.location = action?.url;
            }
        }

        setLoading(false);
        // Submit
    }

    function handleProceed() {
        setShowForm(true);
    }

    return (
        <div className="p-4">
            <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-2 mt-5 xl:divide-x lg:divide-x md:divide-x">
                <div className="xl:p-10 lg:p-10 md:p-10 sm:p-12">
                    <img width="120" src={`/assets/images/serye-fm-logo.png`} />
                    <label className="block mt-5">{form.title}</label>
                    <label className="text-3xl">{form.amount}</label>
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
                                            class="inline mr-2"
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
                                <div class="grid grid-cols-1 gap-2">
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
                                <div class="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block">
                                            Card Number
                                        </label>
                                        <input
                                            type="text"
                                            value={form.cardNumber}
                                            className="rounded border-2 p-2 w-full"
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
                                <div class="grid grid-cols-3 gap-2">
                                    <div>
                                        <label className="block">
                                            Expiry Month
                                        </label>
                                        <input
                                            type="number"
                                            value={form.expiryMonth}
                                            min="1"
                                            max="12"
                                            className="rounded border-2 p-2 w-full"
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
                                            value={form.expiryYear}
                                            className="rounded border-2 p-2 w-full"
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
