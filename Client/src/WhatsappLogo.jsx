import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

function WhatsappLogo() {
  return (
    <>
      <style>
        {`
          .whatsapp-float {
            position: fixed;
            overflow:hidden;
            width: 60px;
            height: 60px;
            bottom: 40px;
            right: 40px;
            background-color: #25d366;
            color: #FFF;
            border-radius: 50px;
            text-align: center;
            font-size: 30px;
            box-shadow: 2px 2px 3px #999;
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
          }
          
          .whatsapp-float:hover {
            width: 200px;
            background-color: #25d366;
          }
          
          .whatsapp-icon {
            position: absolute;
            color:white;
            transition: all 0.3s ease;
          }
          
          .whatsapp-text {
            opacity: 0;
            position: absolute;
            font-size: 16px;
            white-space: nowrap;
            left: 50%;
            transform: translateX(-50%);
            transition: all 0.3s ease;
            margin-left: 40px;
          }
          
          .whatsapp-float:hover .whatsapp-icon {
            left: 20px;
          }
          
          .whatsapp-float:hover .whatsapp-text {
            opacity: 1;
            left: 60px;
          }
        `}
      </style>
      
      <a 
        href="https://wa.me/919016507258" 
        className="whatsapp-float" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="whatsapp-icon" />
        <span className="whatsapp-text">Chat with Us</span>
      </a>
    </>
  );
}

export default WhatsappLogo;