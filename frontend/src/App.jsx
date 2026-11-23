import { useState } from 'react';
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, Building2,
  CarFront, CheckCircle2, ChevronDown, CircleHelp, Fuel,
  Gauge, Globe2, LayoutDashboard, MapPin, Menu, MessageCircle,
  Search, Settings, ShieldCheck, Truck, Users, Wallet,
  Zap, X, Plus, Navigation, Package, Clock3
} from 'lucide-react';
import './App.css';

const states = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa',
  'Benue','Borno','Cross River','Delta','Ebonyi','Edo',
  'Ekiti','Enugu','Gombe','Imo','Jigawa','Kaduna','Kano',
  'Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa',
  'Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers',
  'Sokoto','Taraba','Yobe','Zamfara','Federal Capital Territory'
];

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'booking', label: 'Fuel booking', icon: Fuel },
  { id: 'aggregation', label: 'Smart Join', icon: Package },
  { id: 'stations', label: 'Find stations', icon: MapPin },
  { id: 'fleet', label: 'Fleet & logistics', icon: Truck },
  { id: 'suppliers', label: 'Suppliers', icon: Building2 },
];

function App() {
  const [active, setActive] = useState('overview');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [state, setState] = useState('');
  const [lga, setLga] = useState('');
  const [town, setTown] = useState('');
  const [postcode, setPostcode] = useState('');
  const [station, setStation] = useState('');
  const [fuelType, setFuelType] = useState('PMS');
  const [litres, setLitres] = useState('50');
  const [notice, setNotice] = useState('');

  const pageTitle = navItems.find(item => item.id === active)?.label || 'Overview';

  async function submitBooking(e) {
    e.preventDefault();

    const quantity = Number(litres);
    const isCng = fuelType.trim().toUpperCase() === 'CNG';

    if (!station) {
      setNotice('Please select a filling station.');
      return;
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      setNotice('Please enter a valid fuel quantity.');
      return;
    }

    // CNG requires the updated backend deployment.
    if (isCng) {
      setNotice('CNG bookings will be enabled after the KG-compatible backend is deployed.');
      return;
    }

    try {
      setNotice('Submitting your fuel booking...');

      const response = await fetch(
        'https://sureway-market-access-api-mvp.onrender.com/api/fuel-requests',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            type: fuelType,
            station: station,
            quantity: quantity,
            litres: quantity,
            unit: 'litres'
          })
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Booking submission failed.');
      }

      setNotice(
        'Booking saved successfully! Reference: ' +
        (result.fuelRequestId || 'Confirmed')
      );

    } catch (error) {
      setNotice('Booking error: ' + error.message);
    }
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">S</div>
          <div>
            <strong>Sureway</strong>
            <span>PAY4PUMP PLATFORM</span>
          </div>
          <button className="mobile-close" onClick={() => setMobileMenu(false)} aria-label="Close menu"><X /></button>
        </div>

        <div className="workspace-label">WORKSPACE</div>
        <nav className="main-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.id}
                className={`nav-item ${active === item.id ? 'active' : ''}`}
                onClick={() => { setActive(item.id); setMobileMenu(false); }}>
                <Icon size={19} />
                <span>{item.label}</span>
                {item.id === 'aggregation' && <span className="nav-tag">AI</span>}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><CircleHelp size={19}/></div>
            <strong>Need assistance?</strong>
            <p>Our support team is here to help.</p>
            <button onClick={() => setNotice('Support channels will be connected during backend integration.')}>Contact support <ArrowUpRight size={14}/></button>
          </div>
          <button className="nav-item" onClick={() => setActive('settings')}><Settings size={19}/>Settings</button>
          <div className="company-foot"><ShieldCheck size={16}/> Sureway Integrated Technology Solutions Ltd.</div>
        </div>
      </aside>

      {mobileMenu && <button className="mobile-overlay" onClick={() => setMobileMenu(false)} aria-label="Close navigation"/>}

      <main className="main-area">
        <header className="topbar">
          <button className="menu-button" onClick={() => setMobileMenu(true)} aria-label="Open menu"><Menu/></button>
          <div className="breadcrumb"><span>Pay4Pump</span><span className="crumb-slash">/</span><strong>{pageTitle}</strong></div>
          <div className="top-actions">
            <div className="system-status"><span className="status-dot"/> Platform preview</div>
            <button className="icon-button" aria-label="Search" onClick={() => setNotice('Search will be connected to platform records.')}><Search/></button>
            <button className="icon-button notification" aria-label="Notifications" onClick={() => setNotice('Notifications will appear here when enabled.')}><Bell/><i/></button>
            <div className="avatar">S</div>
          </div>
        </header>

        <div className="content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow"><span/> DIGITAL ENERGY ACCESS</div>
              <h1>{active === 'overview' ? 'Good day. Welcome to Pay4Pump.' : pageTitle}</h1>
              <p className="welcome-sub">A smarter way to coordinate fuel access, demand and distribution.</p>
            </div>
            <button className="outline-button" onClick={() => setActive('booking')}><Plus size={17}/> New fuel booking</button>
          </section>

          {notice && <div className="notice"><CheckCircle2 size={18}/><span>{notice}</span><button onClick={() => setNotice('')}><X size={17}/></button></div>}

          {active === 'overview' && <>
            <section className="hero-panel">
              <div className="hero-copy">
                <div className="hero-pill"><Zap size={14}/> CONNECTING FUEL DEMAND</div>
                <h2>Fuel access,<br/><em>made more intelligent.</em></h2>
                <p>Bring motorists, transport operators, businesses and suppliers into one coordinated energy access ecosystem.</p>
                <div className="hero-buttons">
                  <button className="primary-button" onClick={() => setActive('booking')}>Book fuel <ArrowUpRight size={16}/></button>
                  <button className="hero-link" onClick={() => setActive('aggregation')}>Explore Smart Join <ArrowUpRight size={16}/></button>
                </div>
              </div>
              <div className="hero-visual">
                <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
                <div className="fuel-core"><Fuel size={42}/></div>
                <div className="float-card float-top"><span className="mini-icon"><Activity size={15}/></span><div><b>Demand intelligence</b><small>Coordinated demand signals</small></div></div>
                <div className="float-card float-bottom"><span className="mini-icon green"><Globe2 size={15}/></span><div><b>Nationwide vision</b><small>Designed for all 36 states + FCT</small></div></div>
              </div>
              <div className="hero-glow"/>
            </section>

            <section className="section-heading">
              <div><h2>Platform modules</h2><p>Explore the services being developed across the Pay4Pump ecosystem.</p></div>
              <span className="preview-label">PRODUCT PREVIEW</span>
            </section>

            <section className="module-grid">
              <button className="module-card" onClick={() => setActive('booking')}>
                <div className="module-icon blue"><Fuel/></div><span className="module-arrow"><ArrowUpRight size={17}/></span>
                <h3>Fuel booking</h3><p>Prepare fuel orders and pre-authorisation requests.</p><small>BOOK & PREPAY</small>
              </button>
              <button className="module-card" onClick={() => setActive('aggregation')}>
                <div className="module-icon violet"><Package/></div><span className="module-arrow"><ArrowUpRight size={17}/></span>
                <h3>Smart Join</h3><p>Coordinate group demand for more efficient purchasing.</p><small>DEMAND AGGREGATION</small>
              </button>
              <button className="module-card" onClick={() => setActive('stations')}>
                <div className="module-icon teal"><MapPin/></div><span className="module-arrow"><ArrowUpRight size={17}/></span>
                <h3>Station discovery</h3><p>Build a location-aware network of fuel stations.</p><small>LOCATION INTELLIGENCE</small>
              </button>
              <button className="module-card" onClick={() => setActive('fleet')}>
                <div className="module-icon orange"><Truck/></div><span className="module-arrow"><ArrowUpRight size={17}/></span>
                <h3>Fleet & logistics</h3><p>Support transport operators and fleet fuel needs.</p><small>MOBILITY NETWORK</small>
              </button>
            </section>

            <section className="lower-grid">
              <div className="panel location-panel">
                <div className="panel-title"><div><h3>Nationwide location profile</h3><p>Location architecture for customers, stations and suppliers.</p></div><Globe2 className="panel-title-icon"/></div>
                <div className="location-fields">
                  <label>State / FCT<select value={state} onChange={e => setState(e.target.value)}><option value="">Select state</option>{states.map(s => <option key={s}>{s}</option>)}</select></label>
                  <label>Local Government Area<input value={lga} onChange={e => setLga(e.target.value)} placeholder="Enter LGA"/></label>
                  <label>Town / Community<input value={town} onChange={e => setTown(e.target.value)} placeholder="Enter town or community"/></label>
                  <label>NIPOST postcode<input value={postcode} onChange={e => setPostcode(e.target.value)} placeholder="Enter postcode"/></label>
                </div>
                <div className="directory-note"><ShieldCheck size={16}/><span>Nationwide state list included. Verified LGA, community and NIPOST postcode lookup will connect through the central directory service.</span></div>
              </div>

              <div className="panel access-panel">
                <div className="panel-title"><div><h3>Inclusive access</h3><p>Designed for different users and devices.</p></div><Users className="panel-title-icon"/></div>
                <div className="access-row"><span className="access-icon"><MessageCircle/></span><div><b>WhatsApp AI assistant</b><small>Text and voice interaction planned</small></div><span className="coming">PLANNED</span></div>
                <div className="access-row"><span className="access-icon"><CarFront/></span><div><b>Motorists & riders</b><small>Accessible fuel booking experience</small></div></div>
                <div className="access-row"><span className="access-icon"><Truck/></span><div><b>Fleet operators</b><small>Coordinated fuel demand</small></div></div>
                <div className="access-row"><span className="access-icon"><Building2/></span><div><b>Businesses & suppliers</b><small>Demand and supply coordination</small></div></div>
              </div>
            </section>
          </>}

          {active === 'booking' && <section className="panel form-panel">
            <div className="panel-title"><div><h3>Create a fuel booking</h3><p>Enter your request details. Live booking will be connected to the backend.</p></div><Fuel className="panel-title-icon"/></div>
            <form onSubmit={submitBooking}>
              <div className="form-grid">
<label>Filling station
<select value={station} onChange={e => setStation(e.target.value)} required>
  <option value="">Select filling station</option>
  <option value="AA RANO">AA RANO</option>
  <option value="MRS">MRS</option>
  <option value="DANMARNA">DANMARNA</option>
  <option value="SHEMA">SHEMA</option>
  <option value="BOVAS">BOVAS</option>
  <option value="ARDOVA">ARDOVA</option>
  <option value="TOTALENERGIES">TOTALENERGIES</option>
  <option value="RAINOIL">RAINOIL</option>
  <option value="NAKOWA PETROLEUM">NAKOWA PETROLEUM</option>
  <option value="OANDO">OANDO</option>
</select>
</label>
                <label>Fuel product<select value={fuelType} onChange={e => setFuelType(e.target.value)}><option>PMS</option><option>Diesel (AGO)</option><option>Kerosene (DPK)</option><option>CNG</option></select></label>
                <label>{fuelType === 'CNG' ? 'Quantity (KG)' : 'Quantity (litres)'}<input type="number" min="1" value={litres} onChange={e => setLitres(e.target.value)} required/></label>
                <label>State / FCT<select value={state} onChange={e => setState(e.target.value)} required><option value="">Select state</option>{states.map(s => <option key={s}>{s}</option>)}</select></label>
                <label>Local Government Area<input value={lga} onChange={e => setLga(e.target.value)} placeholder="Enter LGA"/></label>
                <label>Town / Community<input value={town} onChange={e => setTown(e.target.value)} placeholder="Enter town or community"/></label>
                <label>Postcode<input value={postcode} onChange={e => setPostcode(e.target.value)} placeholder="NIPOST postcode"/></label>
              </div>
              <div className="directory-note"><ShieldCheck size={16}/> Postcode validation and station matching will be enabled with the verified nationwide directory.</div>
              <button className="primary-button submit-button" type="submit">Review booking request <ArrowUpRight size={16}/></button>
            </form>
          </section>}

          {active === 'aggregation' && <section className="panel feature-panel"><div className="feature-icon violet"><Package/></div><div><div className="eyebrow">DEMAND AGGREGATION</div><h2>Smart Join</h2><p>Coordinate fuel demand from individuals, SMEs and transport fleets into structured group purchase requests. The next stage connects aggregation thresholds, supplier offers and dispatch workflows to the backend.</p><button className="primary-button" onClick={() => setActive('booking')}>Start with a fuel request <ArrowUpRight size={16}/></button></div></section>}

          {active === 'stations' && <section className="panel feature-panel"><div className="feature-icon teal"><MapPin/></div><div><div className="eyebrow">LOCATION INTELLIGENCE</div><h2>Fuel station discovery</h2><p>Station search will use verified station coordinates, products, availability and the nationwide address directory. Live station data is not connected yet.</p><button className="outline-button" onClick={() => setNotice('Station directory integration is part of the next backend milestone.')}><Navigation size={16}/> Station directory status</button></div></section>}

          {active === 'fleet' && <section className="panel feature-panel"><div className="feature-icon orange"><Truck/></div><div><div className="eyebrow">MOBILITY NETWORK</div><h2>Fleet & logistics</h2><p>Support truck owners, commercial fleets, motorists and riders with coordinated fuel access and location-aware operations.</p><button className="primary-button" onClick={() => setNotice('Fleet onboarding will be connected to the user and role management backend.')}>Explore fleet onboarding <ArrowUpRight size={16}/></button></div></section>}

          {active === 'suppliers' && <section className="panel feature-panel"><div className="feature-icon blue"><Building2/></div><div><div className="eyebrow">SUPPLY NETWORK</div><h2>Suppliers & distributors</h2><p>Build structured connections between verified suppliers, distributors, retailers and aggregated demand.</p><button className="primary-button" onClick={() => setNotice('Supplier verification and catalogue services are planned for backend integration.')}>Supplier access <ArrowUpRight size={16}/></button></div></section>}

          {active === 'settings' && <section className="panel feature-panel"><div className="feature-icon blue"><Settings/></div><div><div className="eyebrow">PLATFORM CONFIGURATION</div><h2>Settings</h2><p>Account preferences, access roles, notifications and organisation settings will be managed here.</p></div></section>}

          <footer className="footer"><span>© 2026 Sureway Integrated Technology Solutions Limited</span><span>Pay4Pump <b>•</b> Digital energy access</span></footer>
        </div>
      </main>
    </div>
  );
}

export default App;
