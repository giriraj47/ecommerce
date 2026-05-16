import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import "../styles/Profile.scss";

const Profile = () => {
  const { user, updateProfile, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    addresses: [],
  });

  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false,
  });

  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        name: user.name || "",
        addresses: user.addresses || [],
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const addAddress = (e) => {
    e.preventDefault();
    if (!newAddress.fullName || !newAddress.address || !newAddress.phone) {
      toast.error("Please fill required address fields");
      return;
    }

    const updatedAddresses = [...formData.addresses, newAddress];
    if (newAddress.isDefault) {
      // Set others to false
      updatedAddresses.forEach((addr, idx) => {
        if (idx !== updatedAddresses.length - 1) addr.isDefault = false;
      });
    }

    setFormData({ ...formData, addresses: updatedAddresses });
    setNewAddress({
      fullName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      isDefault: false,
    });
    setShowAddressForm(false);
    toast.success("Address added locally. Save profile to persist.");
  };

  const removeAddress = (index) => {
    const updatedAddresses = formData.addresses.filter((_, i) => i !== index);
    setFormData({ ...formData, addresses: updatedAddresses });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await updateProfile({
        name: formData.name,
        password: formData.password || undefined, // Only send if changed
        addresses: formData.addresses,
      });
      toast.success("Profile updated successfully!");
      setFormData({ ...formData, password: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    }
  };

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      <form onSubmit={handleSaveProfile}>
        <div className="profile-section">
          <h3>Personal Information</h3>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email (Cannot be changed)</label>
            <input type="email" value={user?.email || ""} disabled />
          </div>
        </div>

        <div className="profile-section">
          <h3>Change Password (Leave blank to keep current)</h3>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="profile-section">
          <h3>Addresses</h3>
          {formData.addresses.map((addr, index) => (
            <div key={index} className="address-card">
              <div className="address-header">
                <h4>
                  {addr.fullName} {addr.isDefault && <span className="badge">Default</span>}
                </h4>
                <button
                  type="button"
                  className="remove-address-btn"
                  onClick={() => removeAddress(index)}
                >
                  Remove
                </button>
              </div>
              <div className="address-details">
                <p>{addr.address}</p>
                <p>
                  {addr.city}, {addr.state} - {addr.postalCode}
                </p>
                <p>{addr.country}</p>
                <p>Phone: {addr.phone}</p>
              </div>
            </div>
          ))}

          {showAddressForm ? (
            <div className="add-address-section">
              <h4>Add New Address</h4>
              <div className="address-form-grid">
                <div className="form-group">
                  <label>Full Name*</label>
                  <input
                    type="text"
                    name="fullName"
                    value={newAddress.fullName}
                    onChange={handleAddressInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Phone*</label>
                  <input
                    type="text"
                    name="phone"
                    value={newAddress.phone}
                    onChange={handleAddressInputChange}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Address*</label>
                  <input
                    type="text"
                    name="address"
                    value={newAddress.address}
                    onChange={handleAddressInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={newAddress.city}
                    onChange={handleAddressInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={newAddress.state}
                    onChange={handleAddressInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={newAddress.postalCode}
                    onChange={handleAddressInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={newAddress.country}
                    onChange={handleAddressInputChange}
                  />
                </div>
                <div className="form-group full-width">
                  <label>
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={newAddress.isDefault}
                      onChange={handleAddressInputChange}
                    />{" "}
                    Set as default address
                  </label>
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" className="save-profile-btn" onClick={addAddress}>
                  Confirm Address
                </button>
                <button
                  type="button"
                  className="save-profile-btn"
                  style={{ background: "#94a3b8" }}
                  onClick={() => setShowAddressForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="btn-add-address"
              onClick={() => setShowAddressForm(true)}
            >
              + Add New Address
            </button>
          )}
        </div>

        <button type="submit" className="save-profile-btn" disabled={loading}>
          {loading ? "Updating..." : "Save All Changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
