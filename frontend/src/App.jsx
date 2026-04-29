import { useState, useEffect } from 'react';
import axios from 'axios';
// 1. Import the CSS Module as 'styles'
import styles from './App.module.css';

function App() {
  const [sqft, setSqft] = useState("");
  const [bhk, setBhk] = useState(0);
  const [bath, setBath] = useState(0);
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [price, setPrice] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/get_location_names');
        setLocations(response.data.locations);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  const handlePredict = async (e) => {
    e.preventDefault(); 
    if (!location) {
      alert("Please select a location first!");
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/predict_home_price', {
        total_sqft: parseFloat(sqft),
        location: location,
        bhk: parseInt(bhk),
        bath: parseInt(bath)
      });
      setPrice(response.data.estimated_price);
    } catch (error) {
      console.error("Error predicting price:", error);
    }
  };

  // 2. Apply styles using className={styles.className}
  return (
    <div className={styles.pageContainer}>
      <div className={styles.glassCard}>
        <h2 className={styles.title}>Bangalore Real Estate Predictor</h2>

        <form onSubmit={handlePredict}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Area (Sqft)</label>
            <input 
              type="number" 
              className={styles.inputField}
              value={sqft} 
              onChange={(e) => setSqft(e.target.value)} 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>BHK</label>
            <input 
              type="number" 
              className={styles.inputField}
              value={bhk} 
              onChange={(e) => setBhk(e.target.value)} 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Bathrooms</label>
            <input 
              type="number" 
              className={styles.inputField}
              value={bath} 
              onChange={(e) => setBath(e.target.value)} 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Location</label>
            <select 
              className={styles.inputField}
              value={location} 
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="" disabled>Choose a location</option>
              {locations.map((loc, index) => (
                <option key={index} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <button type="submit" className={styles.submitBtn}>
            Estimate Price
          </button>
        </form>

        {price !== null && (
          <div className={styles.resultBox}>
            <h3 className={styles.resultText}>₹ {price} Lakhs</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;