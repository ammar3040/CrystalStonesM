import React, { useEffect } from 'react';
import axios from 'axios';

const ProductRichSnippet = () => {
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/all?limit=20`);
        const products = res.data.products || [];

        // Randomly pick 4 products
        const random = [...products].sort(() => 0.5 - Math.random()).slice(0, 4);

        // Map products to JSON-LD schema
        const productSchemas = random.map(p => ({
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": p.productName,
          "image": p.mainImage.url,
          "description": p.description || "Crystal Product by Crystal Stones Mart",
          "sku": p._id,
          "brand": {
            "@type": "Brand",
            "name": "Crystal Stones Mart"
          },
          "offers": {
            "@type": "Offer",
            "priceCurrency": "INR",
            "price": p.dollarPrice,
            "availability": "https://schema.org/InStock",
            "url": `https://www.crystalstonesmart.com/Product/${p._id}`
          }
        }));

        // Inject script into <head>
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.innerHTML = JSON.stringify(productSchemas.length === 1 ? productSchemas[0] : productSchemas);
        script.id = "product-json-ld"; // Optional: Prevent duplication

        // Remove existing one if exists
        const existing = document.getElementById("product-json-ld");
        if (existing) {
          document.head.removeChild(existing);
        }

        document.head.appendChild(script);
      } catch (error) {
        console.error("Failed to load product schema:", error);
      }
    };

    fetchProducts();
  }, []);

  return null;
};

export default ProductRichSnippet;
