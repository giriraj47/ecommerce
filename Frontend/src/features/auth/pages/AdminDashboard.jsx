import React from "react";
import { Link } from "react-router-dom";
import "../styles/admin.scss";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <h2>Admin Dashboard</h2>
        <p>Manage your store, products, and orders from one central hub.</p>
      </div>

      <div className="admin-dashboard__grid">
        <Link to="/admin/create-product" className="admin-card">
          <div className="admin-card__icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </div>
          <h3>Create Product</h3>
          <p>Add a new product to your store's inventory.</p>
        </Link>

        <Link to="/admin/orders" className="admin-card">
          <div className="admin-card__icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <h3>Manage Orders</h3>
          <p>View and update customer order statuses.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
