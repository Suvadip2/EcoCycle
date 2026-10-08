import "../styles/About.css";

function About() {
  return (
    <div className="about-page" id="about">

      {/* ABOUT HERO */}

      <section className="about-hero">

        <h1>About EcoCycle</h1>

        <p>
          Building a cleaner future through responsible
          e-waste management and recycling.
        </p>

      </section>


      {/* ABOUT CONTENT */}

      <section className="about-content">

        <div className="about-intro">

          <h2>What is EcoCycle?</h2>

          <p>
            EcoCycle is an E-Waste Management System designed
            to help users submit, manage and track their
            electronic waste recycling requests.
          </p>

        </div>


        {/* INFORMATION CARDS */}

        <div className="about-cards">

          <div className="about-card">

            <div className="about-card-icon">
              ♻️
            </div>

            <h3>What is E-Waste?</h3>

            <p>
              E-Waste refers to discarded electronic devices
              such as computers, mobile phones, appliances
              and accessories.
            </p>

          </div>


          <div className="about-card">

            <div className="about-card-icon">
              🌱
            </div>

            <h3>Why Recycle Electronics?</h3>

            <p>
              Responsible recycling helps reduce electronic
              waste and promotes the recovery and reuse of
              useful materials.
            </p>

          </div>


          <div className="about-card">

            <div className="about-card-icon">
              📋
            </div>

            <h3>How EcoCycle Works</h3>

            <p>
              Users submit their e-waste through the system.
              Administrators manage the requests and update
              their recycling status.
            </p>

          </div>

        </div>


        {/* HOW IT WORKS */}

        <div className="how-it-works">

          <h2>How EcoCycle Works</h2>

          <div className="steps">

            <div className="step">

              <div className="step-number">
                1
              </div>

              <h3>Submit</h3>

              <p>
                Submit details about your electronic waste.
              </p>

            </div>


            <div className="step">

              <div className="step-number">
                2
              </div>

              <h3>Review</h3>

              <p>
                Our system records and manages your request.
              </p>

            </div>


            <div className="step">

              <div className="step-number">
                3
              </div>

              <h3>Collect</h3>

              <p>
                The e-waste is scheduled for collection.
              </p>

            </div>


            <div className="step">

              <div className="step-number">
                4
              </div>

              <h3>Recycle</h3>

              <p>
                Electronic waste is processed responsibly.
              </p>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default About;