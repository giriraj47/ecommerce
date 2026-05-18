import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import "../styles/products.scss";

const CreateProduct = () => {
  const navigate = useNavigate();
  const { createProduct, loading, error, clearError } = useProducts();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "clothing",
    stock: "",
    sizes: [],
    colors: "",
  });

  const [images, setImages] = useState([]);

  const categories = ["clothing", "shoes", "accessories"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSizeChange = (size) => {
    setFormData((prev) => {
      const newSizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: newSizes };
    });
  };

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("stock", formData.stock);

    // Append sizes individually
    formData.sizes.forEach((size) => data.append("sizes", size));

    // Handle colors (comma separated string to array)
    const colorArray = formData.colors
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c !== "");
    colorArray.forEach((color) => data.append("colors", color));

    // Append images
    images.forEach((image) => data.append("image", image));

    try {
      await createProduct(data);
      alert("Product created successfully!");
      navigate("/products");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-card">
        <h2>Create New Product</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. Slim Fit Denim Jacket"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe your product..."
              rows="4"
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="49.99"
              />
            </div>
            <div className="form-group">
              <label>Stock Quantity</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                placeholder="100"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Sizes</label>
            <input
              type="text"
              name="sizes"
              value={formData.sizes}
              onChange={handleChange}
              placeholder="describe the measurements of the product"
              required
            />
            <div className="checkbox-group"></div>
          </div>

          <div className="form-group">
            <label>Colors (Comma separated)</label>
            <input
              type="text"
              name="colors"
              value={formData.colors}
              onChange={handleChange}
              placeholder="Blue, Black, Grey"
              required
            />
          </div>

          <div className="form-group">
            <label>Product Images (Max 5)</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept="image/*"
              required
            />
            <p className="file-info">{images.length} files selected</p>
          </div>

          <button type="submit" className="admin-submit-btn" disabled={loading}>
            {loading ? "Creating Product..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
