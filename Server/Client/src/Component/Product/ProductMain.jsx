import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/autoplay'; // Don't forget to import autoplay CSS
import { FreeMode, Pagination, Autoplay } from 'swiper/modules'; // Add Autoplay to imports
import ProductCatagory from './ProductCatagory';
import BestProduct from './BestProducts';

import ViewAllMainProduct from '../Pages/ViewAllMainProduct';

export default function ProductMain() {

    return (
        <>
        <ProductCatagory/>
        <BestProduct/>
        <ViewAllMainProduct/>
        </>
    );
}