import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home-page">

      {/* HERO */}
      <section className="home-hero">
        <div className="hero-content">

          <span className="hero-label">
            S&A PREMIUM SUPPLEMENTS
          </span>

          <h1>
            BUILD YOUR
            <span> BEST VERSION.</span>
          </h1>

          <p>
            Premium supplements designed to support
            your training, performance, and goals.
          </p>

          <div className="hero-buttons">
            <Link to="/products" className="hero-primary">
              Shop Products
            </Link>

            <Link to="/about" className="hero-secondary">
              Learn More
            </Link>
          </div>

        </div>

        <div className="hero-decoration">
          <div className="hero-circle"></div>
          <span>S&A</span>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">

        <div className="feature">
          <div className="feature-icon">⚡</div>
          <h3>Premium Quality</h3>
          <p>
            Carefully selected supplements for your
            training journey.
          </p>
        </div>

        <div className="feature">
          <div className="feature-icon">✓</div>
          <h3>Trusted Products</h3>
          <p>
            Quality products you can rely on for your
            daily performance.
          </p>
        </div>

        <div className="feature">
          <div className="feature-icon">↗</div>
          <h3>Train Harder</h3>
          <p>
            Get the support you need to push your
            workouts further.
          </p>
        </div>

      </section>

      {/* CTA */}
      <section className="home-cta">

        <span>READY TO LEVEL UP?</span>

        <h2>
          YOUR GOALS.
          <br />
          YOUR GRIND.
          <br />
          <strong>YOUR RESULTS.</strong>
        </h2>

        <Link to="/products" className="hero-primary">
          Explore Products
        </Link>

      </section>

    </main>
  );
}

export default Home;