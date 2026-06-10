import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import "../../auth/styles/admin.scss";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, updateProduct, loading, error, clearError } =
    useProducts();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "clothing",
    subCategory: "",
    stock: "",
    sizes: "",
    colors: "",
    measurements: "",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const categories = ["clothing", "footwear", "accessories"];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        const p = data.product;
        setFormData({
          name: p.name,
          description: p.description,
          price: p.price,
          category: p.category,
          subCategory: p.subCategory,
          stock: p.stock,
          sizes: p.size,
          colors: p.colors,
          measurements: p.measurements,
        });
        setExistingImages(p.images || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "category") {
        if (value === "clothing") {
          updated.subCategory = "top";
        } else {
          updated.subCategory = "";
        }
      }
      return updated;
    });
    if (error) clearError();
  };

  const handleFileChange = (e) => {
    setNewImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);

    if (formData.category === "clothing") {
      data.append("subCategory", formData.subCategory);
    }

    data.append("stock", formData.stock);
    data.append("size", formData.sizes);
    data.append("colors", formData.colors);
    data.append("measurements", formData.measurements);

    // Append new images if any
    newImages.forEach((image) => data.append("image", image));

    try {
      await updateProduct(id, data);
      alert("Product updated successfully!");
      navigate(`/products/${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-card">
        <h2>Update Product</h2>
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
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
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
              />
            </div>
          </div>

          <div className="form-row">
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
              <label>Subcategory</label>
              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                disabled={formData.category !== "clothing"}
                required={formData.category === "clothing"}
              >
                {formData.category !== "clothing" ? (
                  <option value="">N/A (Clothing Only)</option>
                ) : (
                  <>
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Sizes</label>
            <input
              type="text"
              name="sizes"
              value={formData.sizes}
              onChange={handleChange}
              placeholder="e.g. S, M, L"
              required
            />
          </div>

          <div className="form-group">
            <label>Measurements</label>
            <textarea
              name="measurements"
              value={formData.measurements}
              onChange={handleChange}
              placeholder="e.g. Model is 182 cm X 74 Kg wearing size S. Length 72cm Chest 73cm"
              rows="3"
            ></textarea>
          </div>

          <div className="form-group">
            <label>Colors (Comma separated)</label>
            <input
              type="text"
              name="colors"
              value={formData.colors}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Current Images</label>
            <div className="existing-images-preview">
              {existingImages.map((img, idx) => (
                <img key={idx} src={img} alt="Product" />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Replace Images (Optional)</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept="image/*"
            />
            <p className="file-info">{newImages.length} new files selected</p>
          </div>

          <button type="submit" className="admin-submit-btn" disabled={loading}>
            {loading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
