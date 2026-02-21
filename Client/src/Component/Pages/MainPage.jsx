import React from 'react'

import MainSection from "../MainSection/MainSection"
import BestProduct from '../Product/BestProducts'
import ProductCatagory from '../Product/ProductCatagory'
import RandomTreasures from './RandomTreasures'
import ContactForm from '../Form/ContactForm'
import { Helmet } from 'react-helmet';
import ProductRichSnippet from './ProductRichSnippet';




function MainPage() {
  return (
    <>
      <ProductRichSnippet />
      <Helmet>
        <title>Crystal Stones Mart | Authentic Akik Khambhat & Healing Crystals</title>
        <link rel="canonical" href="https://crystalstonesmart.com/" />
        <meta
          name="description"
          content="Crystal Stones Mart - Premier wholesaler of authentic Khambhat Akik, handmade agate, and natural healing crystals. Quality stones from the heart of Gujarat."
        />
        <meta
          name="keywords"
          content="Khambhat agate, certified akik stones, handmade agate, crystal stones mart, healing crystals India, chakra healing products, wholesale gemstone treasures"
        />
        <meta property="og:title" content="Crystal Stones Mart | Authentic Khambhat Akik & Stones" />
        <meta property="og:description" content="Discover handmade agate and healing crystal products directly from Khambhat, India. Authentic, certified treasures." />
      </Helmet>
      <MainSection />
      <BestProduct />
      <ProductCatagory />
      <RandomTreasures />
      <ContactForm /></>
  )
}

export default MainPage
