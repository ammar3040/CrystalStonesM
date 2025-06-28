// BestProduct.jsx
import React from 'react'
import ProductCard from './BestProdcutCard'
import { Link } from 'react-router-dom'


function BestProduct() {
  const bestProducts = [
    { id: 1, name: 'Blue Lace Agate', price: 45,Oldprice: 45, image: '/ProductImg/IMG-20250617-WA0004.jpg',about:"best Prodcut" },
    { id: 2, name: 'Fire Agate', price: 65,Oldprice: 45, image: '/ProductImg/IMG-20250617-WA0005.jpg' ,about:"best Prodcut" },
    { id: 3, name: 'Moss Agate', price: 38,Oldprice: 45, image: '/ProductImg/IMG-20250617-WA0009.jpg',about:"best Prodcut" },
    { id: 4, name: 'Dendritic Agate', price: 52,Oldprice: 45, image: '/ProductImg/IMG-20250617-WA0010.jpg',about:"best Prodcut" },
    { id: 5, name: 'Crazy Lace Agate', price: 48,Oldprice: 45, image: '/ProductImg/IMG-20250617-WA0011.jpg',about:"best Prodcut" },
    { id: 6, name: 'Sardonyx Agate', price: 55,Oldprice: 45, image: '/ProductImg/IMG-20250617-WA0012.jpg',about:"best Prodcut" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-8">Our Best Selling Agates</h2>
      
      {/* Responsive Grid with Fixed Card Sizes */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

        {bestProducts.map((product) => (
          <Link to={"/Product/"+product.id}>
          <ProductCard
            key={product.id}
            product={product}
            productImg={product.image}
          
            productName={product.name}
            productAbout={product.about}
            ProductPrice={product.price}
            oldProductPrice={product.Oldprice}
          />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default BestProduct