const PAGE_WIDTH = 360;
const PAGE_HEIGHT = 600;
const MARGIN = 32;
const GREEN = [22, 101, 52];
const MUTED = [96, 110, 100];

function formatValue(value) {
  return value === null || value === undefined || value === ""
    ? "Not available"
    : String(value);
}

function drawRecycleMark(doc, centerX, centerY) {
  doc.setDrawColor(...GREEN);
  doc.setFillColor(...GREEN);
  doc.setLineWidth(1.5);
  doc.circle(centerX, centerY, 8, "S");

  [-90, 30, 150].forEach((angle) => {
    const radians = (angle * Math.PI) / 180;
    const tangent = radians + Math.PI / 2;
    const x = centerX + Math.cos(radians) * 8;
    const y = centerY + Math.sin(radians) * 8;
    const tipX = x + Math.cos(tangent) * 3;
    const tipY = y + Math.sin(tangent) * 3;
    const baseX = x - Math.cos(tangent) * 2;
    const baseY = y - Math.sin(tangent) * 2;
    const sideX = -Math.sin(tangent) * 2;
    const sideY = Math.cos(tangent) * 2;

    doc.triangle(
      tipX,
      tipY,
      baseX + sideX,
      baseY + sideY,
      baseX - sideX,
      baseY - sideY,
      "F"
    );
  });
}

export async function createRecyclingReceiptPdf(request, user) {
  if (request?.status !== "Recycled") {
    throw new Error("A recycling receipt is only available for recycled requests.");
  }

  const { jsPDF } = await import("jspdf");
  const reference = `EC-${String(request.id).padStart(4, "0")}`;
  const recyclingDate = request.recycledAt
    ? new Date(request.recycledAt).toLocaleString()
    : "Not recorded";
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: [PAGE_WIDTH, PAGE_HEIGHT],
  });
  const contentWidth = PAGE_WIDTH - MARGIN * 2;
  let y = 40;

  doc.setProperties({
    title: `EcoCycle Recycling Receipt ${reference}`,
    subject: "E-Waste Recycling Receipt",
    author: "EcoCycle",
  });

  doc.setTextColor(...GREEN);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(23);
  doc.text("EcoCycle", PAGE_WIDTH / 2, y, { align: "center" });

  y += 23;
  doc.setTextColor(45, 55, 48);
  doc.setFontSize(13);
  doc.text("E-Waste Recycling Receipt", PAGE_WIDTH / 2, y, {
    align: "center",
  });

  y += 18;
  doc.setDrawColor(205, 218, 208);
  doc.setLineWidth(1);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 25;

  const addRow = (label, value) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...MUTED);
    doc.text(label, MARGIN, y);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(35, 45, 38);
    const lines = doc.splitTextToSize(
      formatValue(value),
      contentWidth - 112
    );
    doc.text(lines, MARGIN + 112, y);
    y += Math.max(19, lines.length * 14 + 5);
  };

  const addSectionTitle = (title) => {
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...GREEN);
    doc.text(title, MARGIN, y);
    y += 19;
  };

  addRow("Receipt ID", reference);
  addRow("Recycling Date", recyclingDate);

  addSectionTitle("Customer Details");
  addRow("Name", user?.name);
  addRow("Email", user?.email);

  addSectionTitle("E-Waste Details");
  addRow("Device/Item", request.deviceName);
  addRow("Category", request.category);
  addRow("Quantity", request.quantity);
  addRow("Weight", request.weight === null || request.weight === undefined
    ? "Not available"
    : `${request.weight} Kg`);
  addRow("Condition", request.condition);

  y += 4;
  doc.setFillColor(232, 247, 237);
  doc.roundedRect(MARGIN, y, contentWidth, 30, 6, 6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...GREEN);
  doc.text("STATUS: RECYCLED", PAGE_WIDTH / 2, y + 19, { align: "center" });

  y += 53;
  doc.setDrawColor(205, 218, 208);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 25;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(45, 55, 48);
  doc.text("Thank you for recycling responsibly!", PAGE_WIDTH / 2, y, {
    align: "center",
  });

  y += 19;
  drawRecycleMark(doc, PAGE_WIDTH / 2, y);
  y += 25;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...GREEN);
  doc.text("EcoCycle", PAGE_WIDTH / 2, y, { align: "center" });
  y += 15;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text("E-Waste Management System", PAGE_WIDTH / 2, y, {
    align: "center",
  });

  doc.internal.pageSize.setHeight(Math.max(PAGE_HEIGHT, y + 32));

  return {
    blob: doc.output("blob"),
    reference,
  };
}

export async function downloadRecyclingReceipt(request, user) {
  const { blob, reference } = await createRecyclingReceiptPdf(request, user);
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");

  downloadLink.href = url;
  downloadLink.download = `EcoCycle_Receipt_${reference}.pdf`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
