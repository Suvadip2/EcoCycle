const STATUS_FLOW = [
  "Pending",
  "Accepted",
  "Pickup Scheduled",
  "Collected",
  "Recycled"
];

function StatusTracker({ currentStatus = "Pending" }) {
  const normalised = STATUS_FLOW.includes(currentStatus) ? currentStatus : "Pending";
  const currentIndex = STATUS_FLOW.indexOf(normalised);

  return (
    <div className="status-tracker">
      {STATUS_FLOW.map((status, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={status} className="tracker-step">
            <div className={`tracker-node ${isCompleted ? "done" : ""} ${isCurrent ? "current" : ""}`}>
              {isCompleted ? "✓" : "○"}
            </div>
            <div className="tracker-label">{status}</div>
            {index !== STATUS_FLOW.length - 1 && <div className="tracker-line" />}
          </div>
        );
      })}
    </div>
  );
}

export default StatusTracker;
