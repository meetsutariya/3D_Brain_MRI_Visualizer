import React, { useState } from 'react';

const Sidebar = ({ onEnter }) => {
  const [coordinates, setCoordinates] = useState({
    x: 0,
    y: 0,
    z: 0
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCoordinates({
      ...coordinates,
      [name]: parseFloat(value)
    });
  }

  const handleSubmit = () => {
    onEnter(coordinates);
  }

  return (
    <div className="sidebar">
      <input 
        type="number" 
        name="x" 
        placeholder="Enter X coordinate" 
        onChange={handleInputChange} 
      />
      <input 
        type="number" 
        name="y" 
        placeholder="Enter Y coordinate" 
        onChange={handleInputChange} 
      />
      <input 
        type="number" 
        name="z" 
        placeholder="Enter Z coordinate" 
        onChange={handleInputChange} 
      />
      <button onClick={handleSubmit}>Enter</button>
    </div>
  );
};

export default Sidebar;
