import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserEWaste } from "../services/api";

const impactFactors = {
  Computers: 3.0,
  "Mobile Devices": 2.0,
  "Home Appliances": 1.5,
  Accessories: 1.0,
  Other: 1.2,
};

function EnvironmentalImpact() {
  const { currentUser } = useAuth();

  const [impact, setImpact] = useState({
    totalWeight: 0,
    recycledWeight: 0,
    recycledItems: 0,
    totalRequests: 0,
    co2Saved: 0,
  });

  const [error, setError] = useState("");

  useEffect(() => {

    const loadImpact = async () => {

      if (!currentUser?.email) {
        return;
      }

      try {

        const requests =
          await getUserEWaste(currentUser.email);

        const list = requests || [];

        const totalWeight = list.reduce(
          (total, item) =>
            total + Number(item.weight || 0),
          0
        );

        const recycledRequests =
          list.filter(
            (item) =>
              item.status === "Recycled"
          );

        const recycledItems =
          recycledRequests.length;

        const recycledWeight =
          recycledRequests.reduce(
            (total, item) =>
              total + Number(item.weight || 0),
            0
          );

        /*
         * Category-based environmental calculation.
         *
         * These are estimated demo factors and should
         * not be treated as certified carbon calculations.
         */
        const co2Saved =
          recycledRequests.reduce(
            (total, item) => {

              const factor =
                impactFactors[item.category] || 1.2;

              return (
                total +
                Number(item.weight || 0) *
                factor
              );

            },
            0
          );

        setImpact({
          totalWeight,
          recycledWeight,
          recycledItems,
          totalRequests: list.length,
          co2Saved,
        });

        setError("");

      } catch (error) {

        console.error(
          "Failed to load environmental impact:",
          error
        );

        setError(
          "Unable to load environmental impact data."
        );
      }
    };

    loadImpact();

    const interval =
      setInterval(
        loadImpact,
        3000
      );

    return () =>
      clearInterval(interval);

  }, [currentUser?.email]);

  return (

    <div className="page">

      <div className="section-heading">

        <div>

          <h2>
            Environmental Impact
          </h2>

          <p>
            See your contribution towards a cleaner
            and greener environment.
          </p>

        </div>

      </div>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      <div className="dashboard-stats">

        <div className="stat-card">

          <div className="stat-icon">
            ♻️
          </div>

          <div>

            <h3>
              {impact.totalWeight.toFixed(1)} Kg
            </h3>

            <p>
              Total E-Waste Submitted
            </p>

          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            🌱
          </div>

          <div>

            <h3>
              {impact.recycledItems}
            </h3>

            <p>
              Devices Recycled
            </p>

          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            📦
          </div>

          <div>

            <h3>
              {impact.recycledWeight.toFixed(1)} Kg
            </h3>

            <p>
              Recycled E-Waste
            </p>

          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            🌍
          </div>

          <div>

            <h3>
              {impact.co2Saved.toFixed(1)} Kg
            </h3>

            <p>
              Estimated CO₂ Saved
            </p>

          </div>

        </div>

      </div>

      <div className="dashboard-section">

        <h2>
          Your Environmental Contribution
        </h2>

        <div className="user-info-card">

          <div>

            <strong>
              E-Waste Submitted
            </strong>

            <p>
              {impact.totalWeight.toFixed(1)} Kg
            </p>

          </div>

          <div>

            <strong>
              Recycled E-Waste
            </strong>

            <p>
              {impact.recycledWeight.toFixed(1)} Kg
            </p>

          </div>

          <div>

            <strong>
              Recycled Devices
            </strong>

            <p>
              {impact.recycledItems}
            </p>

          </div>

          <div>

            <strong>
              Estimated CO₂ Reduction
            </strong>

            <p>
              {impact.co2Saved.toFixed(1)} Kg
            </p>

          </div>

        </div>

      </div>

      <div className="dashboard-section">

        <h2>
          Category-Based Environmental Calculation
        </h2>

        <div className="user-info-card">

          <p>
            EcoCycle estimates CO₂ savings using
            different factors for different e-waste
            categories. The calculation is applied to
            recycled e-waste only.
          </p>

          <p>
            <strong>
              Computers:
            </strong>{" "}
            3.0 Kg CO₂ / Kg recycled
          </p>

          <p>
            <strong>
              Mobile Devices:
            </strong>{" "}
            2.0 Kg CO₂ / Kg recycled
          </p>

          <p>
            <strong>
              Home Appliances:
            </strong>{" "}
            1.5 Kg CO₂ / Kg recycled
          </p>

          <p>
            <strong>
              Accessories:
            </strong>{" "}
            1.0 Kg CO₂ / Kg recycled
          </p>

          <p>
            <strong>
              Other:
            </strong>{" "}
            1.2 Kg CO₂ / Kg recycled
          </p>

          <p>
            <strong>
              Note:
            </strong>{" "}
            These values are estimated project factors
            for demonstrating environmental impact and
            are not certified carbon-accounting values.
          </p>

        </div>

      </div>

    </div>
  );
}

export default EnvironmentalImpact;
