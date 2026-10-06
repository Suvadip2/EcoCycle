const impactFactors = {
  Computers: 3.0,
  "Mobile Devices": 2.0,
  "Home Appliances": 1.5,
  Accessories: 1.0,
  Other: 1.2,
};

export function calculateCo2Saved(requests) {
  return requests
    .filter((request) => request.status === "Recycled")
    .reduce((total, request) => {
      const factor = impactFactors[request.category] || impactFactors.Other;
      return total + Number(request.weight || 0) * factor;
    }, 0);
}
