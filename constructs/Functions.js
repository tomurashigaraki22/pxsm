export const addToSMM = (amount, service, orderId, userId) => {
    console.log("Amount: ", amount, ". Service: ", service, ". OrderId: ", orderId, ". UserId: ", userId)
    return (amount + service + orderId + userId).toString()
}