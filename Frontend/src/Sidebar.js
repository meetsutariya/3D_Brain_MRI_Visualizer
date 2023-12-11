import React, { useState , useEffect} from 'react';
import { addPoint, setPoint } from "./main";

const Sidebar = ({ onEnter }) => {
  const [coordinates, setCoordinates] = useState({
    x: undefined,
    y: undefined,
    z: undefined
  });

  const [savedCoordinates, setSavedCoordinates] = useState([]);
  console.log(savedCoordinates)

  const [error, setError] = useState('');


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCoordinates({
      ...coordinates,
      [name]: parseFloat(value)
    });
  }

  const handleSubmit = () => {
      // Check if all coordinates are entered
      if (coordinates.x === undefined || coordinates.y === undefined || coordinates.z === undefined) {
        setError('Please enter valid coordinates');

        // Clear the error message after 2 seconds
      setTimeout(() => {
        setError('');
      }, 2000);
        return;
    }

    onEnter({
      x: parseFloat(coordinates.x),
      y: parseFloat(coordinates.y),
      z: parseFloat(coordinates.z)
    });
      }

  const saveCurrentCoordinates = () => {
    setSavedCoordinates([...savedCoordinates, addPoint()]);
    console.log(savedCoordinates)
  }

  const handleEdit = (index, updatedCoords) => {

    console.log("updated:" ,updatedCoords)

    const updatedSavedCoordinates = savedCoordinates.map((coord, i) => {
      if (i === index) {
        return updatedCoords;
      }
      return coord;
    });
    setSavedCoordinates(updatedSavedCoordinates);
  }

  const handleDelete = (index) =>{
    setSavedCoordinates(savedCoordinates.filter((_,i) => i!=index));
  }

  const handleGo = (coordinates) =>{
    setPoint(coordinates.x, coordinates.y, coordinates.z)
    // onEnter(coordinates);
  }

  return (
    <div className="sidebar">
      <div style={{marginTop: '10px', marginBottom: '10px'}}>
        <button className='sidebar-button' onClick={saveCurrentCoordinates}> <strong>Save Current Coordinates</strong></button>
      </div>

      <div className='coordinate-box'>
      {error && <div style={{ color: 'red' }}>{error}</div>}

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
      <button className='sidebar-button' style={{marginLeft: '4px'}} onClick={handleSubmit}>Enter</button>
      </div>
      {savedCoordinates.map((coord, index) => (
        <SavedCoordinate 
          key={index} 
          coordinate={coord} 
          onSave={(updatedCoords) => handleEdit(index, updatedCoords)} 
          onGo={() => handleGo(coord)}
          onDelete={() => handleDelete(index)}
        />
      ))}

    </div>
  );
};


const SavedCoordinate = ({ coordinate, onSave, onGo, onDelete}) => {
  const [editMode, setEditMode] = useState(false);
  
  // Initialize coords state with default values to avoid undefined errors
  const [coords, setCoords] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    console.log('coordinates: ', coordinate)
    console.log('coords: ', coords)
    setCoords(coordinate || { x: 0, y: 0, z: 0 });
  }, [coordinate]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCoords({
      ...coords,
      [name]: parseFloat(value)
    });
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  }

  const handleSave = () => {
    onSave(coords);
    toggleEditMode();
  }


  return (
    <div className="coordinate-box">
      {editMode ? (
        <div>
          <input 
            type="number" 
            name="x" 
            value={coords.x} 
            onChange={handleEditChange} 
          />
          <input 
            type="number" 
            name="y" 
            value={coords.y} 
            onChange={handleEditChange} 
          />
          <input 
            type="number" 
            name="z" 
            value={coords.z} 
            onChange={handleEditChange} 
          />
          <button className='sidebar-button' onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div className='coordinate-display'>
          <div className='coordinate-values'>
            {`X: ${coords.x}, Y: ${coords.y}, Z: ${coords.z}`}
            <div style={{marginTop: '5px'}}></div>
          <button className='sidebar-button' onClick={toggleEditMode} style={{ marginRight: '10px' }}>Edit</button>
          <button className='sidebar-button' onClick={onDelete} style={{ marginRight: '10px' }}>Delete</button>
          <button className='sidebar-button' onClick={onGo} >Go</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;