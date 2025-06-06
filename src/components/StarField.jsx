import React, { useEffect, useState } from 'react';

const StarField = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generateStars = () => {
      const starCount = 50;
      const newStars = [];
      
      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          animationDelay: Math.random() * 3
        });
      }
      
      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div className="star-field">
      {stars.map(star => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: `${star.animationDelay}s`
          }}
        />
      ))}
    </div>
  );
};

export default StarField;