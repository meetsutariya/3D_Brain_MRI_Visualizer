import React ,{ useState }from 'react';
import {
  Route,
  Routes,
} from 'react-router-dom';
import FileUploader from './FileUploader';
import Visualization from './Visualization';
import './App.css';
import RouteListener from './RouterListener';

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);

  return (
    // <Router>

    <div className="App">
        <RouteListener/>
        <Routes>
          <Route path="/"  element={<FileUploader setUploadedFile={setUploadedFile} />} />
          <Route path="/visualization" element={<Visualization uploadedFile={uploadedFile} />} />
        
        </Routes>
      </div>
    // </Router>
  );
}

export default App;
