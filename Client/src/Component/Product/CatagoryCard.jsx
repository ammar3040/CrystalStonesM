import React, { useState } from 'react';
const CategoryCard = ({ category }) => {

  const [isHovered, setIsHovered] = useState(false);

  return (
     <a href={`/catagory/${category.category}`}>
    <div 
      className="category-card"
      style={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="blob" style={styles.blob}></div>
      <div className="bg" style={{
        ...styles.bg,
        transform: isHovered ? 'scale(1.03)' : 'scale(1)',
      }}></div>
      
      <div className="content" style={{
        ...styles.content,
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
      }}>
        <div style={styles.imageContainer}>
          <img 
            src={category.mainImage.url|| "/img/product1.jpg"} 
            alt={category.category} 
            style={{
              ...styles.image,
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            }}
          />
        </div>
        <h3 style={styles.title}>{category.category}</h3>
      
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        
        .category-card:hover {
          animation: float 2s ease-in-out infinite;
        }
        
        .blob {
          position: absolute;
          z-index: 1;
          top: 50%;
          left: 50%;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background-color: rgba(255, 248, 168, 0.7);
          filter: blur(12px);
          animation: blob-bounce 8s infinite ease;
        }

        @keyframes blob-bounce {
          0% { transform: translate(-100%, -100%) translate3d(0, 0, 0); }
          25% { transform: translate(-100%, -100%) translate3d(100%, 0, 0); }
          50% { transform: translate(-100%, -100%) translate3d(100%, 100%, 0); }
          75% { transform: translate(-100%, -100%) translate3d(0, 100%, 0); }
          100% { transform: translate(-100%, -100%) translate3d(0, 0, 0); }
        }
      `}</style>
    </div>
    </a>
  );
};

const styles = {
  card: {
    position: 'relative',
    minWidth: '200px',
    height: '280px',
    borderRadius: '16px',
    zIndex: '1',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    margin: '10px',
  },
  blob: {
    position: 'absolute',
    zIndex: '1',
    top: '50%',
    left: '50%',
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 248, 168, 0.7)',
    filter: 'blur(12px)',
  },
  bg: {
    position: 'absolute',
    top: '5px',
    left: '5px',
    width: 'calc(100% - 10px)',
    height: 'calc(100% - 10px)',
    zIndex: '2',
    backdropFilter: 'blur(16px)',
    borderRadius: '12px',
    overflow: 'hidden',
    outline: '1px solid rgba(255,255,255,0.5)',
    transition: 'transform 0.3s ease',
  },
  content: {
    position: 'relative',
    zIndex: '3',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    textAlign: 'center',
    color: 'black',
    transition: 'transform 0.3s ease',
  },
  imageContainer: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: '8px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '50%',
    border: '3px solid white',
    transition: 'transform 0.3s ease',
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '10px',
    color: '#333',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  description: {
    fontSize: '0.85rem',
    color: '#666',
    margin: '0',
    lineHeight: '1.4',
  },
};

export default CategoryCard;