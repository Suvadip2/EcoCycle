import "../styles/Categories.css";

function Categories() {
  const categories = [
    {
      name: "Computers",
      icon: "💻",
      description:
        "Laptops, desktops, monitors and computer components."
    },
    {
      name: "Mobile Devices",
      icon: "📱",
      description:
        "Mobile phones, tablets and related devices."
    },
    {
      name: "Home Appliances",
      icon: "🏠",
      description:
        "Electronic household appliances."
    },
    {
      name: "Accessories",
      icon: "🔌",
      description:
        "Chargers, cables, keyboards, mice and other accessories."
    },
    {
      name: "Other",
      icon: "♻️",
      description:
        "Other electronic devices not listed above."
    }
  ];

  return (
    <div className="categories-page" id="categories">

      {/* HEADER */}

      <section className="categories-hero">

        <h1>E-Waste Categories</h1>

        <p>
          Explore the different types of electronic waste that
          can be responsibly recycled through EcoCycle.
        </p>

      </section>


      {/* CATEGORY CARDS */}

      <section className="categories-container">

        <div className="category-grid">

          {categories.map((category) => (

            <div
              className="category-card"
              key={category.name}
            >

              <div className="category-icon">
                {category.icon}
              </div>

              <h2>
                {category.name}
              </h2>

              <p>
                {category.description}
              </p>

            </div>

          ))}

        </div>


        {/* CTA */}

        <div className="categories-cta">

          <h2>Have E-Waste to Recycle?</h2>

          <p>
            Submit your electronic waste and help create
            a cleaner and more sustainable environment.
          </p>

        </div>

      </section>

    </div>
  );
}

export default Categories;