import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect } from "react";
import { createCapturePayment } from "@/store/shopping/order-slice";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { AppDispatch } from "@/store/store";

const PaypalReturnPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paymentId = params.get("paymentId");
    const payerId = params.get("PayerID");

    useEffect(() => {
        if (paymentId && payerId) {
            const orderIdString = sessionStorage.getItem("currentOrderId");
            if (orderIdString) {
                const orderId = JSON.parse(orderIdString);
                dispatch(createCapturePayment({ paymentId, payerId, orderId })).then((data) => {
                    if (data.payload.success) {
                        sessionStorage.removeItem("currentOrderId");
                        window.location.href = "/shopping/payment-success";
                    }
                });
            } else {
                console.error("No orderId found in sessionStorage");
            }
        }
    }, [paymentId, payerId, dispatch]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Processing Payment...Please wait!</CardTitle>
            </CardHeader>
        </Card>
    );
};

export default PaypalReturnPage;