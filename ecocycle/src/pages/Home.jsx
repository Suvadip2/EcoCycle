import "../styles/Home.css";
import About from "./About";
import Categories from "./Categories";

function Home({ setCurrentPage }) {
  return (
    <div className="home-page" id="home">
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            Give Your E-Waste a <span>Second Life</span>
          </h1>

          <p>
            Recycle responsibly, reduce electronic waste,
            and contribute to a cleaner environment.
          </p>

          <div className="hero-buttons">
            <button className="primary-button" onClick={() => setCurrentPage("login")}>
              Submit E-Waste
            </button>

            <button className="secondary-button" onClick={() => setCurrentPage("about")}>
              Learn More
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="recycle-circle">♻️</div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-container">
          <div className="section-title">
            <h2>Why Choose EcoCycle?</h2>
            <p>
              Simple, responsible and convenient e-waste management.
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">📦</div>
              <h3>Easy Submission</h3>
              <p>
                Submit your electronic waste quickly and
                easily through our simple system.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">♻️</div>
              <h3>Responsible Recycling</h3>
              <p>
                Help ensure electronic waste is handled
                and recycled responsibly.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3>Environmental Impact</h3>
              <p>
                Track your contribution towards a cleaner
                and more sustainable environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-cta">
        <h2>Ready to Recycle Your E-Waste?</h2>
        <p>Start your recycling journey with EcoCycle today.</p>

        <button className="secondary-button" onClick={() => setCurrentPage("login")}>
          Get Started
        </button>
      </section>

      <About />
      <Categories />
    </div>
  );
}

export default Home;