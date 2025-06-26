import React, { useState, useEffect } from "react";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <EcommerceProductListingPage />
    </div>
  );
}

// EcommerceProductListingPage.jsx

const BRANDS = ["Apple", "Samsung", "Huawei", "OPPO", "Microsoft"];
const RATINGS = [5, 4, 3, 2, 1];

function EcommerceProductListingPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    priceFrom: "",
    priceTo: "",
    brands: [],
    ratings: [],
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters, search, page]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("https://dummyjson.com/products/categories");
      const data = await response.json();
      const simplified = Array.isArray(data)
        ? data
            .slice(0, 10)
            .map((item) => (typeof item === "object" ? item.name : item))
        : [];
      setCategories(simplified);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `https://dummyjson.com/products/search?q=${search}&limit=100`
      );
      const data = await response.json();
      let filtered = data.products;

      if (filters.category) {
        filtered = filtered.filter((p) => p.category === filters.category);
      }
      if (filters.priceFrom) {
        filtered = filtered.filter(
          (p) => p.price >= parseFloat(filters.priceFrom)
        );
      }
      if (filters.priceTo) {
        filtered = filtered.filter(
          (p) => p.price <= parseFloat(filters.priceTo)
        );
      }
      if (filters.brands.length > 0) {
        filtered = filtered.filter((p) => filters.brands.includes(p.brand));
      }
      if (filters.ratings.length > 0) {
        filtered = filtered.filter((p) =>
          filters.ratings.includes(Math.floor(p.rating))
        );
      }

      const start = (page - 1) * 12;
      const paginated = filtered.slice(start, start + 12);
      setProducts(paginated);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const toggleRating = (rating) => {
    setFilters((prev) => {
      const newRatings = prev.ratings.includes(rating)
        ? prev.ratings.filter((r) => r !== rating)
        : [...prev.ratings, rating];
      return { ...prev, ratings: newRatings };
    });
  };

  const toggleCategory = (category) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === category ? "" : category,
    }));
  };

  const toggleBrand = (brand) => {
    setFilters((prev) => {
      const newBrands = prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand];
      return { ...prev, brands: newBrands };
    });
  };

  return (
    <div className="store-container">
      <h1>Devtools Tech Ecommerce Store</h1>

      {/* Category Tabs */}
      <div className="categories">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => toggleCategory(cat)}
            className={filters.category === cat ? "active" : ""}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="layout">
        {/* Left Sidebar Filters */}
        <div className="sidebar">
          <div>
            <h4>Price Range</h4>
            <input
              type="number"
              placeholder="FROM ($)"
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, priceFrom: e.target.value }))
              }
            />
            <input
              type="number"
              placeholder="TO ($)"
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, priceTo: e.target.value }))
              }
            />
          </div>

          <div>
            <h4>Brand</h4>
            {BRANDS.map((b) => (
              <div key={b}>
                <input
                  type="checkbox"
                  checked={filters.brands.includes(b)}
                  onChange={() => toggleBrand(b)}
                />
                {b}
              </div>
            ))}
          </div>

          <div>
            <h4>Average Rating</h4>
            {RATINGS.map((r) => (
              <div key={r}>
                <input
                  type="checkbox"
                  checked={filters.ratings.includes(r)}
                  onChange={() => toggleRating(r)}
                />
                {"★".repeat(r)}
                {"☆".repeat(5 - r)}
              </div>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="products">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="grid">
            {products.map((p) => (
              <div className="product-card" key={p.id}>
                <img src={p.thumbnail} alt={p.title} />
                <h3>{p.title}</h3>
                <div>
                  {"★".repeat(Math.round(p.rating))}
                  {"☆".repeat(5 - Math.round(p.rating))}
                </div>
                <p>${p.price}</p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button onClick={() => setPage((p) => Math.max(p - 1, 1))}>
              Previous
            </button>
            <span>Page {page}</span>
            <button onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
