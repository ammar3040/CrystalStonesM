import React from 'react'

import MainSection from "../MainSection/MainSection"
import ProductMain from "../Product/ProductMain"
import ContactForm from '../Form/ContactForm'
import { Helmet } from 'react-helmet';
import ProductRichSnippet from './ProductRichSnippet';




function MainPage() {
  return (
    <>
    <ProductRichSnippet/>
     <Helmet>
        <title>Home | Crystal Stone Smart</title>
        <link rel="canonical" href="https://crystalstonesmart.com/" />
         <meta
    name="keywords"
    content="Khambhat agate, handmade agate, agate stones, crystal products, healing stones, chakra stones, gemstone, crystal jewelry"
  />
     </Helmet>
      <MainSection/>
      <ProductMain/>
      <ContactForm/></>
  )
}

export default MainPage