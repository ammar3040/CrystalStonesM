import React from "react";
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const ContactForm = () => {
  const styles = {
    contactFormContainer: {
      position: "relative",
      width: "100%",
      minHeight: "100vh",
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
    formContainer: {
      width: "100%",
      maxWidth: "1000px",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "20px",
      zIndex: 1,
      borderRadius: "10px",
    },
    contactInfo: {
      backgroundColor: "rgba(255,255,255,0.9)",
      borderLeft: "3px solid black",
      padding: "2rem",
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      order: 1,
    },
    contactForm: {
      backgroundColor: "rgba(255,255,255,0.9)",
      padding: "2rem",
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      order: 2,
    },
    title: {
      color: "#333",
      fontWeight: 600,
      fontSize: "1.5rem",
      marginBottom: "1.2rem",
    },
    subtitle: {
      color: "#555",
      fontSize: "0.9rem",
      marginBottom: "1.5rem",
      lineHeight: "1.6",
    },
    information: {
      display: "flex",
      alignItems: "flex-start",
      marginBottom: "1.2rem",
      color: "#444",
      fontSize: "1rem",
      fontWeight: "600"
    },
    icon: {
      color: "black",
      marginRight: "1rem",
      fontSize: "1rem",
      marginTop: "3px",
    },
    socialIcons: {
      display: "flex",
      marginTop: "1.5rem",
      flexWrap: "wrap",
    },
    socialIcon: {
      width: "35px",
      height: "35px",
      borderRadius: "50%",
      backgroundColor: "#fff8a8",
      color: "black",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: "0.8rem",
      marginBottom: "0.8rem",
      transition: "all 0.3s ease",
    },
    inputContainer: {
      marginBottom: "1.2rem",
    },
    input: {
      width: "100%",
      padding: "0.7rem 1rem",
      border: "1px solid #ddd",
      borderRadius: "5px",
      fontSize: "0.9rem",
      transition: "border 0.3s ease",
    },
    textarea: {
      minHeight: "120px",
      resize: "vertical",
    },
    btn: {
      backgroundColor: "#fff8a8",
      color: "black",
      border: "none",
      padding: "0.7rem 1.5rem",
      borderRadius: "5px",
      fontSize: "0.9rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
      width: "100%",
    },
  };

  return (
    <div style={styles.contactFormContainer}>
      <div style={styles.overlay}></div>
      
      <div style={styles.formContainer}>
        {/* Owner Information Section */}
        <div style={styles.contactInfo}>
          <h3 style={styles.title}>Contact Information</h3>
          <p style={styles.subtitle}>
            Feel free to reach out to us through any of these channels. We're here to help!
          </p>
          
          <div style={styles.information}>
            <FaMapMarkerAlt style={styles.icon} />
            <p>123 Business Avenue, Suite 456, New York, NY 10001</p>
          </div>
          
          <div style={styles.information}>
            <FaEnvelope style={styles.icon} />
            <p>contact@yourbusiness.com</p>
          </div>
          
          <div style={styles.information}>
            <FaPhone style={styles.icon} />
            <p>+1 (555) 123-4567</p>
          </div>
          
          <div style={styles.socialIcons}>
            <a href="#" style={styles.socialIcon}>
              <FaFacebookF />
            </a>
            <a href="#" style={styles.socialIcon}>
              <FaTwitter />
            </a>
            <a href="#" style={styles.socialIcon}>
              <FaInstagram />
            </a>
            <a href="#" style={styles.socialIcon}>
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Contact Form Section */}
        <div style={styles.contactForm}>
          <h3 style={styles.title}>Send Us a Message</h3>
          
          <form>
            <div style={styles.inputContainer}>
              <input 
                type="text" 
                placeholder="Your Name" 
                style={styles.input} 
                required 
              />
            </div>
            
            <div style={styles.inputContainer}>
              <input 
                type="email" 
                placeholder="Your Email" 
                style={styles.input} 
                required 
              />
            </div>
            
            <div style={styles.inputContainer}>
              <input 
                type="tel" 
                placeholder="Phone Number" 
                style={styles.input} 
              />
            </div>
            
            <div style={styles.inputContainer}>
              <textarea 
                placeholder="Your Message" 
                style={{...styles.input, ...styles.textarea}} 
                required
              ></textarea>
            </div>
            
            <button type="submit" style={styles.btn}>
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;