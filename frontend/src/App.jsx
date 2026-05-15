// import UploadForm from "./components/UploadForm";
// import Dashboard from "./components/Dashboard";
// import WalletConnect from "./components/WalletConnect";
// import { useState } from "react";

// export default function App() {
//   const [account, setAccount] = useState("");

//   return (
//     <div>
//       <WalletConnect setAccount={setAccount} />

//       <UploadForm account={account} />

//       <Dashboard />
//     </div>
//   );
// }

import UploadForm from "./components/UploadForm";
import Dashboard from "./components/Dashboard";
import WalletConnect from "./components/WalletConnect";
import { useEffect, useState } from "react";
import "./index.css";

export default function App() {
  const [account, setAccount] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mouseGlow, setMouseGlow] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateScroll = () => {
      const scrollTop = window.scrollY;
      const pageHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress = pageHeight > 0 ? (scrollTop / pageHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    const updateMouseGlow = (e) => {
      setMouseGlow({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("scroll", updateScroll);
    window.addEventListener("mousemove", updateMouseGlow);

    updateScroll();

    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("mousemove", updateMouseGlow);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("js-scroll-ready");

    const elements = document.querySelectorAll(".scroll-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    elements.forEach((el) => {
      observer.observe(el);

      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("show");
      }
    });

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      document.documentElement.classList.remove("js-scroll-ready");
    };
  }, []);

  return (
    <div className="app-shell">
      <div
        className="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
      ></div>

      <div
        className="cursor-gold-glow"
        style={{
          left: `${mouseGlow.x}px`,
          top: `${mouseGlow.y}px`,
        }}
      ></div>

      <div className="luxury-bg"></div>
      <div className="royal-noise"></div>
      <div className="gold-line left"></div>
      <div className="gold-line right"></div>

      <div className="floating-orb orb-one"></div>
      <div className="floating-orb orb-two"></div>
      <div className="floating-orb orb-three"></div>

      <div className="premium-radial-light light-one"></div>
      <div className="premium-radial-light light-two"></div>
      <div className="premium-radial-light light-three"></div>

      <div className="luxury-ring ring-one"></div>
      <div className="luxury-ring ring-two"></div>

      <div className="royal-particles">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <header className="navbar scroll-reveal reveal-down">
        <div className="brand">
          <div className="brand-seal">P</div>

          <div>
            <h1>Pramaan</h1>
            <p>Document Authentication Registry</p>
          </div>
        </div>

        <WalletConnect setAccount={setAccount} />
      </header>

      <main className="main-layout">
        <section className="hero scroll-reveal reveal-zoom">
          <div className="hero-ornament">◆ ✦ ◆</div>

          <p className="hero-kicker">Blockchain Secured Verification</p>

          <h2>
            Authentic Documents.
            <br />
            Verified With Trust.
          </h2>

          <p className="hero-desc">
            A premium document registry platform for registering and verifying
            digital documents using wallet authentication, secure hashing, and
            blockchain-backed proof.
          </p>

          <div className="hero-pills">
            <span>Smart Contract</span>
            <span>Document Hashing</span>
            <span>Wallet Based Access</span>
          </div>

          <div className="trust-strip">
            <div>
              <strong>256-bit</strong>
              <span>Hash Security</span>
            </div>
            <div>
              <strong>On-chain</strong>
              <span>Proof Storage</span>
            </div>
            <div>
              <strong>Instant</strong>
              <span>Document Check</span>
            </div>
          </div>

          <div className="live-engine-badge">
            <span></span>
            Live verification engine active
          </div>
        </section>

        <section className="content-grid">
          <div className="main-card premium-frame scroll-reveal reveal-left">
            <div className="card-depth-light"></div>
            <div className="card-luxury-sheen"></div>
            <div className="corner corner-tl"></div>
            <div className="corner corner-tr"></div>
            <div className="corner corner-bl"></div>
            <div className="corner corner-br"></div>

            <div className="card-heading">
              <span>Registry Console</span>
              <h3>Upload, Register & Verify</h3>
            </div>

            <UploadForm account={account} />
          </div>

          <aside className="side-card premium-frame scroll-reveal reveal-right">
            <div className="card-depth-light"></div>
            <div className="card-luxury-sheen"></div>
            <div className="corner corner-tl"></div>
            <div className="corner corner-tr"></div>
            <div className="corner corner-bl"></div>
            <div className="corner corner-br"></div>

            <span className="side-label">Secure Workflow</span>

            <div className="step-box">
              <b>01</b>
              <div>
                <h4>Connect Wallet</h4>
                <p>Use MetaMask to authorize blockchain actions.</p>
              </div>
            </div>

            <div className="step-box">
              <b>02</b>
              <div>
                <h4>Upload Document</h4>
                <p>Generate a unique file hash for authentication.</p>
              </div>
            </div>

            <div className="step-box">
              <b>03</b>
              <div>
                <h4>Verify Proof</h4>
                <p>Check whether the document is original or modified.</p>
              </div>
            </div>

            <div className="security-badge">
              <span></span>
              Smart contract protected
            </div>

            <div className="mini-status-grid">
              <div>
                <small>Wallet</small>
                <strong>{account ? "Connected" : "Waiting"}</strong>
              </div>
              <div>
                <small>Registry</small>
                <strong>Ready</strong>
              </div>
            </div>
          </aside>
        </section>

        <section className="dashboard-wrap premium-frame scroll-reveal reveal-up">
          <div className="card-depth-light"></div>
          <div className="card-luxury-sheen"></div>
          <div className="corner corner-tl"></div>
          <div className="corner corner-tr"></div>
          <div className="corner corner-bl"></div>
          <div className="corner corner-br"></div>

          <div className="section-title">
            <span>Registered Records</span>
            <h3>Dashboard</h3>
          </div>

          <Dashboard />
        </section>
      </main>

      <footer className="footer scroll-reveal reveal-up">
        <span>Pramaan</span>
        <p>Luxury Blockchain Document Authentication Platform</p>
      </footer>
    </div>
  );
}
