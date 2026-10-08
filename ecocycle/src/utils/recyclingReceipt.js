export function downloadRecyclingReceipt(request, user) {
  if (request?.status !== "Recycled") {
    return;
  }

  const reference = `EC-${String(request.id).padStart(4, "0")}`;
  const recyclingDate = request.recycledAt
    ? new Date(request.recycledAt).toLocaleString()
    : "Not recorded";
  const receipt = [
    "EcoCycle",
    "E-Waste Recycling Receipt",
    "",
    `Reference ID: ${reference}`,
    `User Name: ${user?.name || "Not available"}`,
    `Email: ${user?.email || "Not available"}`,
    "",
    `Device: ${request.deviceName || "Not available"}`,
    `Category: ${request.category || "Not available"}`,
    `Quantity: ${request.quantity ?? "Not available"}`,
    `Condition: ${request.condition || "Not available"}`,
    `Status: ${request.status}`,
    `Recycling Date: ${recyclingDate}`,
    "",
    "Thank you for recycling responsibly!",
    "EcoCycle",
  ].join("\r\n");
  const blob = new Blob([receipt], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");

  downloadLink.href = url;
  downloadLink.download = `EcoCycle_Receipt_${reference}.txt`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
