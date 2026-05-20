import React from "react";
import "../styles/footer.scss";

const Footer = () => {
  return (
    <footer className="custom-footer">
      {/* Ticker / Running Text Top Bar */}
      <div className="ticker-wrapper">
        <div className="ticker-content">
          <span>DEFINING STYLE</span> <div className="ticker-icon"></div>
          <span>DEFINING STYLE</span> <div className="ticker-icon"></div>
          <span>DEFINING STYLE</span> <div className="ticker-icon"></div>
          <span>DEFINING STYLE</span> <div className="ticker-icon"></div>
          {/* Duplicated for infinite seamless loop */}
          <span>DEFINING STYLE</span> <div className="ticker-icon"></div>
          <span>DEFINING STYLE</span> <div className="ticker-icon"></div>
          <span>DEFINING STYLE</span> <div className="ticker-icon"></div>
          <span>DEFINING STYLE</span> <div className="ticker-icon"></div>
        </div>
      </div>

      {/* Main Footer Body Container */}
      <div className="footer-body">
        {/* Left Side: Socials and Copyright */}
        <div className="footer-left">
          <div className="footer-socials">
            <h3 className="links-title">SOCIALS</h3>
            <div className="social-icons">
              <a href="#instagram" aria-label="Instagram">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#x" aria-label="X (Twitter)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                </svg>
              </a>
              <a href="#reddit" aria-label="Reddit">
                <svg
                  width="26"
                  height="21"
                  viewBox="0 0 26 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.823 0C13.0616 0 11.747 1.43895 11.747 3.07598V5.90916C9.43694 6.03174 7.32428 6.64765 5.63773 7.61367C4.9878 6.98955 4.11753 6.7124 3.27374 6.71302C2.35888 6.71369 1.42362 7.03071 0.778502 7.75639L0.763737 7.7728L0.748973 7.7892C0.130124 8.56262 -0.114919 9.59871 0.0501099 10.6273C0.200823 11.5667 0.744875 12.5097 1.69063 13.1275C1.68444 13.2317 1.66767 13.3339 1.66767 13.4392C1.66767 17.607 6.56624 20.9987 12.587 20.9987C18.6077 20.9987 23.5063 17.607 23.5063 13.4392C23.5063 13.3339 23.4895 13.2317 23.4833 13.1275C24.4291 12.5097 24.9732 11.5667 25.1239 10.6273C25.2889 9.59871 25.0438 8.56262 24.425 7.7892L24.4102 7.7728L24.3955 7.75639C23.7503 7.03061 22.8152 6.71369 21.9002 6.71302C21.0564 6.7124 20.186 6.98932 19.5362 7.61367C17.8497 6.64765 15.737 6.03174 13.4269 5.90916V3.07598C13.4269 2.25365 13.9017 1.6799 14.823 1.6799C15.2604 1.6799 15.7932 1.89904 16.6276 2.19174C17.333 2.43917 18.251 2.68926 19.4247 2.76428C19.7054 3.59421 20.4849 4.19974 21.4064 4.19974C22.5614 4.19974 23.5063 3.2548 23.5063 2.09987C23.5063 0.944941 22.5614 0 21.4064 0C20.6179 0 19.9345 0.445526 19.5756 1.09259C18.5723 1.03702 17.8352 0.835503 17.1837 0.606994C16.4246 0.340706 15.7271 0 14.823 0ZM3.27374 8.39292C3.60563 8.39267 3.92097 8.47977 4.18095 8.62095C3.25365 9.39496 2.55009 10.2993 2.12537 11.2868C1.89986 11.0084 1.76396 10.6959 1.71032 10.3615C1.6198 9.79736 1.78864 9.21091 2.05647 8.86375C2.30957 8.59132 2.77174 8.39328 3.27374 8.39292ZM21.8986 8.39292C22.4007 8.39329 22.8645 8.5914 23.1175 8.86375C23.3853 9.21091 23.5542 9.79736 23.4637 10.3615C23.41 10.6959 23.2741 11.0084 23.0486 11.2868C22.6239 10.2993 21.9203 9.39496 20.993 8.62095C21.2524 8.47994 21.5668 8.39267 21.8986 8.39292ZM8.38725 10.0794C9.31539 10.0794 10.0671 10.8311 10.0671 11.7593C10.0671 12.6874 9.31539 13.4392 8.38725 13.4392C7.45911 13.4392 6.70735 12.6874 6.70735 11.7593C6.70735 10.8311 7.45911 10.0794 8.38725 10.0794ZM16.7867 10.0794C17.7149 10.0794 18.4666 10.8311 18.4666 11.7593C18.4666 12.6874 17.7149 13.4392 16.7867 13.4392C15.8586 13.4392 15.1068 12.6874 15.1068 11.7593C15.1068 10.8311 15.8586 10.0794 16.7867 10.0794ZM16.9869 14.727C16.4501 16.2952 14.7339 17.6389 12.587 17.6389C10.4401 17.6389 8.72383 16.2958 8.1871 14.8402C9.15304 15.6238 10.7626 16.1838 12.587 16.1838C14.4114 16.1838 16.0209 15.6232 16.9869 14.727Z"
                    fill="white"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div className="footer-copyright">© 2026 LIGHTSTORE</div>
        </div>

        {/* Center: Brand Logo */}
        <div className="footer-logo">
          <div className="logo-image"></div>
          <div className="logo-text">LIGHTSTORE</div>
        </div>

        {/* Right Side: Links Navigation */}
        <div className="footer-links">
          <h3 className="links-title">SHOP</h3>
          <ul className="links-list">
            <li>
              <a href="#all-products">All Products</a>
            </li>
            <li>
              <a href="#clothing">Clothing</a>
            </li>
            <li>
              <a href="#footware">Footware</a>
            </li>
            <li>
              <a href="#accessories">Accessories</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
