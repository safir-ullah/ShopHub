import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-dark text-white mt-5">
      <div className="container py-5">
        <div className="row g-4">
          {/* Brand */}
          <div className="col-md-6">
            <h4 className="fw-bold mb-2">ShopHub</h4>
            <p className="text-white-50 mb-0">
              Everything you need, all in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-6 text-md-end">
            <h6 className="fw-bold mb-3">Quick Links</h6>

            <div className="d-flex gap-3 justify-content-md-end flex-wrap mb-3">
              <Link to="/" className="footer-link">
                Home
              </Link>

              <Link to="/products" className="footer-link">
                Products
              </Link>

              <Link to="/wishlist" className="footer-link">
                Wishlist
              </Link>

              <Link to="/cart" className="footer-link">
                Cart
              </Link>
            </div>

            <p className="mb-0 text-white-50">
              © 2026 ShopHub. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;