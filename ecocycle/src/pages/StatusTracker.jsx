function StatusTracker({ status }) {
  const statuses = [
    "Pending",
    "Accepted",
    "Pickup Scheduled",
    "Collected",
    "Recycled",
  ];

  const currentIndex = statuses.indexOf(status);

  return (
    <div
      style={{
        background: "#ffffff",
        padding: "25px",
        borderRadius: "14px",
        boxShadow: "0 4px 18px rgba(0, 0, 0, 0.08)",
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: "25px" }}>
        Request Status
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        {statuses.map((item, index) => {
          const completed = index <= currentIndex;

          return (
            <div
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: completed
                    ? "#2e7d32"
                    : "#eeeeee",
                  color: completed
                    ? "#ffffff"
                    : "#777777",
                  fontWeight: "bold",
                }}
              >
                {completed ? "✓" : "○"}
              </div>

              <span
                style={{
                  fontWeight:
                    item === status
                      ? "700"
                      : "500",
                  color:
                    item === status
                      ? "#2e7d32"
                      : "#333333",
                }}
              >
                {item}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StatusTracker;