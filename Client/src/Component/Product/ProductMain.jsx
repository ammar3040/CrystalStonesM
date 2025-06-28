import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/autoplay'; // Don't forget to import autoplay CSS
import { FreeMode, Pagination, Autoplay } from 'swiper/modules'; // Add Autoplay to imports
import ProductCatagory from './ProductCatagory';
import BestProduct from './BestProducts';

export default function ProductMain() {
    let allPath = [
        "/img/ProductBraclate.webp",
        "/img/ProdcutCrystalAngle.webp",
        "/img/ProductCrystalTree.webp",
        "/img/ProductPendulum.webp",
        "/img/ProductWorryStone.webp",
        "/img/ProductCrystalTree.webp",
        "/img/ProductPendulum.webp",
        "/img/ProductWorryStone.webp"
    ];

    return (
        <>
        <ProductCatagory/>
        <BestProduct/>
        </>
    );
}