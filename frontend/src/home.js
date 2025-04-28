import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <header className="hero">
        <h1>Find Professional Services</h1>
        <p>Connect with skilled professionals for your home maintenance needs</p>
        <div className="cta-buttons">
          <Link to="/register?role=customer" className="btn btn-primary">
            Need a Service?
          </Link>
          <Link to="/register?role=provider" className="btn btn-secondary">
            Become a Service Provider
          </Link>
        </div>
      </header>

      <section className="services">
        <h2>Our Services</h2>
        <div className="service-grid">
          {['Plumbing', 'AC Repair', 'Electrical', 'Carpentry', 'Cleaning'].map((service) => (
            <div key={service} className="service-card">
              <h3>{service}</h3>
              <p>Professional {service.toLowerCase()} services at your doorstep</p>
              <Link to="/login" className="btn btn-outline">
                Book Now
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <h3>1. Choose a Service</h3>
            <p>Browse through our wide range of professional services</p>
          </div>
          <div className="step">
            <h3>2. Book an Appointment</h3>
            <p>Select your preferred time and date</p>
          </div>
          <div className="step">
            <h3>3. Get it Done</h3>
            <p>Our professional will arrive and complete the service</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;