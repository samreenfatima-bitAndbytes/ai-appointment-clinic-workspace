import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Landing() {
  const { user } = useAuth();
  return (
    <div>
      <section className="bnb-hero">
        <div className="bnb-hero-media" aria-hidden="true">
          <img src="/img/hero-clinic.jpg" alt="" />
          <div className="bnb-hero-scrim" />
        </div>
        <header className="site-nav site-nav--overlay">
          <Link to="/" className="brand" aria-label="AI Appointment">
            <img className="brand-logo" src="/logo-transparent.png" alt="AI Appointment" />
          </Link>
          <div className="topbar-actions">
            <Link className="btn btn-on-dark" to={user ? "/app" : "/login"}>
              {user ? "Open workspace" : "Sign in"}
            </Link>
          </div>
        </header>
        <div className="bnb-wrap">
          <div className="bnb-hero-content">
            <h1>Book clients with an assistant that knows your calendar</h1>
            <p className="bnb-hero-lead">
              Manage appointments, clients, availability, and a FAQ assistant — demoed
              entirely in the browser.
            </p>
            <div className="bnb-hero-cta">
              <Link className="btn btn-on-dark" to={user ? "/app" : "/login"}>
                {user ? "Go to dashboard" : "Try the demo"}
              </Link>
              <Link className="btn btn-outline-light" to="/login">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bnb-section">
        <div className="bnb-wrap bnb-split">
          <div>
            <div className="bnb-section-head">
              <h2>Built for clinics and service teams</h2>
              <p className="muted">
                Mirror of the Django AI Appointment System: calendar, clients, slots, and
                document-trained chat — without backend setup.
              </p>
            </div>
            <div className="bnb-steps">
              <article>
                <span className="bnb-step-num">01</span>
                <h3>Clients</h3>
                <p className="muted">Keep contact details and notes in one workspace.</p>
              </article>
              <article>
                <span className="bnb-step-num">02</span>
                <h3>Calendar</h3>
                <p className="muted">Schedule appointments against weekly availability.</p>
              </article>
              <article>
                <span className="bnb-step-num">03</span>
                <h3>Assistant</h3>
                <p className="muted">Answer FAQs from uploaded clinic documents.</p>
              </article>
            </div>
          </div>
          <figure className="bnb-photo">
            <img src="/img/feature-schedule.jpg" alt="Scheduling on a laptop" />
          </figure>
        </div>
      </section>

      <section className="bnb-section bnb-band">
        <div className="bnb-wrap bnb-cta-panel">
          <div>
            <h2 style={{ fontFamily: "var(--display)", margin: "0 0 0.35rem" }}>
              Ready to try scheduling?
            </h2>
            <p className="muted" style={{ margin: 0 }}>
              Open the static workspace with seeded Harbor Wellness Clinic data.
            </p>
          </div>
          <Link className="btn btn-primary" to={user ? "/app" : "/login"}>
            Get started
          </Link>
        </div>
      </section>
    </div>
  );
}
