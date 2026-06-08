import { useState } from 'react';
import Navigation from '../components/Navigation';

export default function StyleGuide() {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [toggleStates, setToggleStates] = useState({
    sound: true,
    animations: false,
  });

  const colors = [
    { name: 'Green', rgb: 'rgb(88, 204, 2)', hex: '#58CC02' },
    { name: 'Green Hover', rgb: 'rgb(75, 178, 0)', hex: '#4BB200' },
    { name: 'Blue', rgb: 'rgb(28, 176, 246)', hex: '#1CB0F6' },
    { name: 'Dark Blue', rgb: 'rgb(16, 15, 62)', hex: '#100F3E' },
    { name: 'Red', rgb: '', hex: '#FF4B4B' },
    { name: 'Orange', rgb: '', hex: '#FF9600' },
    { name: 'Golden', rgb: '', hex: '#FFC800' },
    { name: 'Footer Green', rgb: '', hex: '#4EC604' },
    { name: 'Gray Text', rgb: 'rgb(75, 75, 75)', hex: '#4B4B4B' },
    { name: 'Gray Light', rgb: 'rgb(119, 119, 119)', hex: '#777777' },
    { name: 'Nav Text', rgb: 'rgb(175, 175, 175)', hex: '#AFAFAF' },
    { name: 'Border', rgb: 'rgb(229, 229, 229)', hex: '#E5E5E5' },
  ];

  const toggleChange = (key: 'sound' | 'animations') => {
    setToggleStates((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div>
      <Navigation />

      {/* Hero Section */}
      <section className="hero">
        <h1 style={{ fontFamily: "'Feather Bold', sans-serif" }}>duolingo design</h1>
        <p>A comprehensive visual reference for the Duolingo design system covering colors, typography, button variants, cards, and UI components.</p>
        <div className="hero-buttons">
          <button className="btn btn-primary">Get Started</button>
          <button className="btn btn-secondary">I Already Have an Account</button>
        </div>
      </section>

      {/* Grid Container */}
      <div className="grid-container">
        {/* Panel 1: Color Palette */}
        <div className="grid-panel">
          <div className="grid-panel-label">Colors</div>
          <div className="color-grid">
            {colors.map((color, idx) => (
              <div key={idx} className="color-swatch">
                <div
                  className="color-box"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="color-name">{color.name}</div>
                <div className="color-hex">{color.hex}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 2: Typography */}
        <div className="grid-panel">
          <div className="grid-panel-label">Type</div>
          <div className="type-grid">
            <div className="type-row">
              <div className="type-meta">
                <div className="type-size">48px</div>
                <div className="type-weight">Feather Bold</div>
              </div>
              <div className="type-sample" style={{ fontSize: '48px', fontFamily: "'Feather Bold', sans-serif", color: 'var(--green)' }}>
                Display
              </div>
            </div>

            <div className="type-row">
              <div className="type-meta">
                <div className="type-size">32px</div>
                <div className="type-weight">Bold 700</div>
              </div>
              <div className="type-sample" style={{ fontSize: '32px', fontWeight: 700, color: 'var(--gray-text)' }}>
                Heading One
              </div>
            </div>

            <div className="type-row">
              <div className="type-meta">
                <div className="type-size">28px</div>
                <div className="type-weight">Feather Bold</div>
              </div>
              <div className="type-sample" style={{ fontSize: '28px', fontFamily: "'Feather Bold', sans-serif", color: 'var(--green)' }}>
                heading two
              </div>
            </div>

            <div className="type-row">
              <div className="type-meta">
                <div className="type-size">18px</div>
                <div className="type-weight">Medium 500</div>
              </div>
              <div className="type-sample" style={{ fontSize: '18px', fontWeight: 500, color: 'var(--gray-light)', lineHeight: 1.6 }}>
                Body text for paragraphs and descriptions with comfortable reading line-height.
              </div>
            </div>

            <div className="type-row">
              <div className="type-meta">
                <div className="type-size">14px</div>
                <div className="type-weight">Bold 700</div>
              </div>
              <div className="type-sample" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--nav-text)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Caption Label
              </div>
            </div>

            <div className="type-row">
              <div className="type-meta">
                <div className="type-size">12px</div>
                <div className="type-weight">Semi 600</div>
              </div>
              <div className="type-sample" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gray-light)' }}>
                Small utility text for metadata and hints
              </div>
            </div>
          </div>
        </div>

        {/* Panel 3: Button Variants */}
        <div className="grid-panel">
          <div className="grid-panel-label">Buttons</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '80px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--nav-text)' }}>
                Primary
              </div>
              <button className="btn btn-primary">Get Started</button>
              <button className="btn btn-primary btn-primary-small">Small</button>
              <button className="btn btn-primary" disabled>
                Disabled
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '80px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--nav-text)' }}>
                Secondary
              </div>
              <button className="btn btn-secondary">Learn More</button>
              <button className="btn btn-secondary btn-secondary-small">Small</button>
              <button className="btn btn-secondary" disabled>
                Disabled
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '80px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--nav-text)' }}>
                Danger
              </div>
              <button className="btn btn-danger">Delete</button>
              <button className="btn btn-danger btn-danger-small">Remove</button>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '80px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--nav-text)' }}>
                Ghost
              </div>
              <button className="btn btn-ghost">View All</button>
            </div>
          </div>
        </div>

        {/* Panel 4: Dark Theme Buttons */}
        <div className="grid-panel dark-bg">
          <div className="grid-panel-label">Dark Buttons</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button className="btn btn-primary">Get Started</button>
              <button className="btn dark-bg btn-primary-white">Try 1 Week Free</button>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button className="btn btn-primary btn-primary-small">Small</button>
              <button className="btn dark-bg btn-primary-white btn-primary-white-small">Small</button>
            </div>
          </div>
        </div>

        {/* Panel 5: Cards */}
        <div className="grid-panel">
          <div className="grid-panel-label">Cards</div>
          <div className="card-grid">
            <div className="card">
              <img
                src="https://images.pexels.com/photos/4145354/pexels-photo-4145354.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop"
                alt="Spanish Course"
                className="card-image"
              />
              <div className="card-body">
                <div className="card-tag new">New</div>
                <h3 className="card-title">Spanish for Beginners</h3>
                <p className="card-description">Start your language journey with interactive lessons designed to build fluency.</p>
                <div className="card-footer">
                  <span>12 Units</span>
                  <span className="card-footer-action">Start</span>
                </div>
              </div>
            </div>

            <div className="card">
              <img
                src="https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop"
                alt="French Course"
                className="card-image"
              />
              <div className="card-body">
                <div className="card-tag popular">Popular</div>
                <h3 className="card-title">French Conversations</h3>
                <p className="card-description">Practice real-world dialogue and improve pronunciation with native speakers.</p>
                <div className="card-footer">
                  <span>8 Units</span>
                  <span className="card-footer-action">Continue</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 6: Dark Theme Cards */}
        <div className="grid-panel dark-bg">
          <div className="grid-panel-label">Dark Cards</div>
          <div className="card-grid">
            <div className="card">
              <div className="card-body">
                <div className="card-tag premium">Super</div>
                <h3 className="card-title">Unlimited Hearts</h3>
                <p className="card-description">Keep learning without interruption with Super Duolingo benefits.</p>
                <div className="card-footer">
                  <span>Premium</span>
                  <span className="card-footer-action">Upgrade</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="card-tag pro">Pro</div>
                <h3 className="card-title">Mastery Quizzes</h3>
                <p className="card-description">Challenge yourself with advanced assessments to test your skill level.</p>
                <div className="card-footer">
                  <span>Advanced</span>
                  <span className="card-footer-action">Try Now</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 7: Components */}
        <div className="grid-panel">
          <div className="grid-panel-label">Components</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Badges */}
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--nav-text)', marginBottom: '12px' }}>
                Badges
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-completed">Completed</span>
                <span className="badge badge-in-progress">In Progress</span>
                <span className="badge badge-failed">Failed</span>
                <span className="badge badge-streak">Streak</span>
                <span className="badge badge-premium">Premium</span>
              </div>
            </div>

            {/* Input + Button */}
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--nav-text)', marginBottom: '12px' }}>
                Input & Button
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input type="email" placeholder="Enter your email" style={{ flex: 1 }} />
                <button className="btn btn-primary">Subscribe</button>
              </div>
            </div>

            {/* Toggles */}
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--nav-text)', marginBottom: '12px' }}>
                Toggles
              </div>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <label className="toggle">
                    <input type="checkbox" checked={toggleStates.sound} onChange={() => toggleChange('sound')} />
                    <div className="toggle-track"></div>
                    <div className="toggle-thumb"></div>
                  </label>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>Sound effects</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <label className="toggle">
                    <input type="checkbox" checked={toggleStates.animations} onChange={() => toggleChange('animations')} />
                    <div className="toggle-track"></div>
                    <div className="toggle-thumb"></div>
                  </label>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>Animations</span>
                </div>
              </div>
            </div>

            {/* Progress Bars */}
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--nav-text)', marginBottom: '12px' }}>
                Progress
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="progress-container">
                  <div className="progress-bar-wrapper">
                    <div className="progress-fill green" style={{ width: '85%' }}></div>
                  </div>
                  <div className="progress-value">85%</div>
                </div>
                <div className="progress-container">
                  <div className="progress-bar-wrapper">
                    <div className="progress-fill blue" style={{ width: '60%' }}></div>
                  </div>
                  <div className="progress-value">60%</div>
                </div>
                <div className="progress-container">
                  <div className="progress-bar-wrapper">
                    <div className="progress-fill orange" style={{ width: '35%' }}></div>
                  </div>
                  <div className="progress-value">35%</div>
                </div>
              </div>
            </div>

            {/* Tooltip & Streak */}
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--nav-text)', marginBottom: '12px' }}>
                Tooltip & Streak
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div className="tooltip-wrapper">
                  <div className="tooltip-trigger">Hover me</div>
                  <div className="tooltip-bubble">This is a helpful tooltip!</div>
                </div>
                <div className="streak-counter">
                  <span className="streak-emoji">🔥</span>
                  <span className="streak-number">42</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 8: Dark Theme Components */}
        <div className="grid-panel dark-bg">
          <div className="grid-panel-label">Dark Components</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Language Pills */}
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255, 255, 255, 0.3)', marginBottom: '12px' }}>
                Languages
              </div>
              <div className="language-pills">
                <button className="language-pill active">
                  <img src="https://d35aaqx5ub95lt.cloudfront.net/vendor/59a90a2cedd48b751a8fd22014768fd7.svg" alt="Spanish" className="language-pill-flag" />
                  <span className="language-pill-text">Spanish</span>
                </button>
                <button className="language-pill inactive">
                  <img src="https://d35aaqx5ub95lt.cloudfront.net/vendor/482fda142ee4abd728ebf4ccce5d3307.svg" alt="French" className="language-pill-flag" />
                  <span className="language-pill-text">French</span>
                </button>
                <button className="language-pill inactive">
                  <img src="https://d35aaqx5ub95lt.cloudfront.net/vendor/c71db846ffab7e0a74bc6971e34ad82e.svg" alt="German" className="language-pill-flag" />
                  <span className="language-pill-text">German</span>
                </button>
                <button className="language-pill inactive">
                  <img src="https://d35aaqx5ub95lt.cloudfront.net/vendor/edea4fa18ff3e7d8c0282de3f102aaed.svg" alt="Japanese" className="language-pill-flag" />
                  <span className="language-pill-text">Japanese</span>
                </button>
              </div>
            </div>

            {/* Avatar Group */}
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255, 255, 255, 0.3)', marginBottom: '12px' }}>
                Avatar Group
              </div>
              <div className="avatar-group">
                <div className="avatars">
                  <img
                    src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop"
                    alt="User 1"
                    className="avatar"
                  />
                  <img
                    src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop"
                    alt="User 2"
                    className="avatar"
                  />
                  <img
                    src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop"
                    alt="User 3"
                    className="avatar"
                  />
                  <div className="avatar-count">+5</div>
                </div>
                <span className="avatar-group-text">8 learners active</span>
              </div>
            </div>

            {/* Dark Progress */}
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255, 255, 255, 0.3)', marginBottom: '12px' }}>
                Progress
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="progress-container">
                  <div className="progress-bar-wrapper" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
                    <div className="progress-fill" style={{ width: '72%', backgroundColor: 'var(--golden)' }}></div>
                  </div>
                  <div className="progress-value" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    72%
                  </div>
                </div>
                <div className="progress-container">
                  <div className="progress-bar-wrapper" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
                    <div className="progress-fill green" style={{ width: '45%' }}></div>
                  </div>
                  <div className="progress-value" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    45%
                  </div>
                </div>
              </div>
            </div>

            {/* Dark Badges */}
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255, 255, 255, 0.3)', marginBottom: '12px' }}>
                Status Badges
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge" style={{ backgroundColor: 'rgba(122, 219, 46, 0.15)', color: '#7ADB2E' }}>
                  Mastered
                </span>
                <span className="badge" style={{ backgroundColor: 'rgba(77, 196, 248, 0.15)', color: '#4DC4F8' }}>
                  Review
                </span>
                <span className="badge" style={{ backgroundColor: 'rgba(255, 200, 0, 0.15)', color: 'var(--golden)' }}>
                  Crown
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
