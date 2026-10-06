function RequestTable({ requests = [], onView, onDelete, canDelete = false }) {
  return (
    <div className="table-wrapper">
      <table className="request-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Device</th>
            <th>Category</th>
            <th>Qty</th>
            <th>Condition</th>
            <th>Weight</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan="9" className="empty-table">
                No requests found.
              </td>
            </tr>
          ) : (
            requests.map((request) => (
              <tr key={request.id}>
                <td>#{request.id}</td>
                <td>{request.deviceName}</td>
                <td>{request.category}</td>
                <td>{request.quantity}</td>
                <td>{request.condition}</td>
                <td>{request.weight} Kg</td>
                <td>
                  <span className={`status-badge ${String(request.status).toLowerCase().replace(/\s+/g, "-")}`}>
                    {request.status}
                  </span>
                </td>
                <td>{new Date(request.createdAt || Date.now()).toLocaleDateString()}</td>
                <td className="table-actions">
                  <button type="button" className="small-button" onClick={() => onView(request)}>
                    View
                  </button>
                  {canDelete && (
                    <button type="button" className="small-button danger" onClick={() => onDelete(request.id)}>
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RequestTable;
