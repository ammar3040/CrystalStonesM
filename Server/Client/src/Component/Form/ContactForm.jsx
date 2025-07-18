import React from "react";
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const ContactForm = () => {
  const styles = {
    contactContainer: {
      position: "relative",
      
      minHeight: "90vh",
      backgroundImage: "url('/img/Contact-formbg.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backdropFilter: "blur(1px)",
      zIndex: 0,
    },
    contactCard: {
      backgroundColor: "rgba(255,255,255,0.9)",
      padding: "3rem",
      borderRadius: "10px",
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      maxWidth: "800px",
      height:"70% !important",
      width: "100%",
      textAlign: "center",
      zIndex: 1,
    },
    title: {
      color: "#333",
      fontWeight: 600,
      fontSize: "2rem",
      marginBottom: "1.5rem",
    },
    subtitle: {
      color: "#555",
      fontSize: "1rem",
      marginBottom: "2rem",
      lineHeight: "1.6",
    },
    contactItem: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "1.5rem",
      color: "#444",
      fontSize: "1.1rem",
    },
    icon: {
      color: "black",
      marginRight: "1rem",
      fontSize: "1.2rem",
    },
    socialIcons: {
      display: "flex",
      justifyContent: "center",
      marginTop: "2rem",
      flexWrap: "wrap",
    },
    socialIcon: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: "#fff8a8",
      color: "black",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0.5rem",
      transition: "all 0.3s ease",
    },
  };

  return (
    <div style={styles.contactContainer} id="contactForm">
      <div style={styles.overlay}></div>
      
      <div style={styles.contactCard}>
        <h3 style={styles.title}>Contact Us</h3>
        <p style={styles.subtitle}>
  We'd love to hear from you! Reach out through any of these channels for 
  <span style={styles.highlight}>product details</span>, 
  <span style={styles.highlight}>inquiries</span>, or any other questions.
</p>
        
        <div style={styles.contactItem}>
          <div>
          <FaMapMarkerAlt style={styles.icon}  />
          </div>
          <a href="https://www.google.co.in/maps/dir//22.31963000,72.61826000">
          <p>T0072 A, Pirajpur near Arab parlour, Near Dargah, Khambhat, Anand-388620, Gujarat, India</p>
          </a>
        </div>
        
        <div style={styles.contactItem}>
          <FaEnvelope style={styles.icon} />
           <a 
    href="mailto:crystalstonesmart@gmail.com" 
    style={{
      color: '#444',
      textDecoration: 'none',
      ':hover': {
        textDecoration: 'underline'
      }
    }}
  >
          <p>support@crystalstonesmart.in</p>
          </a>
        </div>
        
        <div style={styles.contactItem}>
          <FaPhone style={styles.icon} />
          <a href={`tel:+91 9016507258`} style={styles.phoneLink}>
          <p>+91 9016507258</p>
          </a>
        </div>
        
        <div style={styles.socialIcons}>
          <a href="#" style={styles.socialIcon}>
            <FaFacebookF />
          </a>
         
          <a href="#" style={styles.socialIcon}>
            <FaInstagram />
          </a>
         
        </div>
      </div>
    </div>
  );
};

export default ContactForm;