import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css';

function App() {
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [waistMeasurements, setWaistMeasurements] = useState([]);
  const [selectedMeasurement, setSelectedMeasurement] = useState(null);
  const [newMeasurement, setNewMeasurement] = useState('');

  useEffect(() => {
    setWaistMeasurements([]);
  }, [height, weight, age]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.get(`https://${process.env.REACT_APP_SERVER}/measurements?height=${height}&age=${age}&weight=${weight}`)
        .then(res => {
          console.log(res.data);
          const measurements = res.data.waist_measurements.sort();
          setWaistMeasurements(measurements);
          setSelectedMeasurement('');
        })
      .catch(err => console.log(err));
  }

  const handleNewSize = (e) => {
    e.preventDefault();
    axios.post(`https://${process.env.REACT_APP_SERVER}/measurements`, { height:height,weight:weight,age:age,waist:newMeasurement })
    .then(res => {
      setWaistMeasurements([...waistMeasurements, newMeasurement]);
      setSelectedMeasurement(newMeasurement);
      setNewMeasurement('');
    })
    .catch(err => console.log(err));
  }

  return (
    <div className='mt-12 ml-8 w-full'>
      <p className='text-4xl text-center'>Check Your Waist!</p>
      <form className='flex flex-col  w-full'  onSubmit={handleSubmit}>
        <div className='flex flex-col w-2/12'>
          <label className='ml-2'>
            Height
          </label>
          <input type="text" className='border mb-4 p-2 border-black rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 focus:outline-none' value={height} onChange={e => setHeight(e.target.value)} />
        </div>

        <div className='flex flex-col w-2/12'>
          <label className='ml-2'>
            Age
          </label>
          <input type="text" value={age} className='border mb-4 p-2 border-black rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 focus:outline-none' onChange={e => setAge(e.target.value)} />
        </div>

        <div className='flex flex-col w-2/12'>
          <label className='ml-2'>
            Weight
          </label>
          <input type="text" value={weight} className='border mb-4 p-2 border-black rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 focus:outline-none' onChange={e => setWeight(e.target.value)} />
        </div>
        <button disabled={!height || !weight || !age} className={`mt-4 w-2/12 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-black border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 bg-white flex-shrink-0 ${(!height || !weight || !age) && "opacity-50"}`} >
          Submit
        </button>
      </form>
      { waistMeasurements.length > 0 ?
        (<div className='mt-8'>
          <div className='flex flex-col w-2/12'>
            <label>
              Select your waist measurement
            </label>
              <select className='border mb-4 p-2 border-black rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 focus:outline-none' value={selectedMeasurement} onChange={e => setSelectedMeasurement(e.target.value)}>
                <option value=""></option>
                {waistMeasurements.map(measurement => (
                  <option value={measurement} key={measurement}>{measurement}</option>
                  ))}
              </select>
            </div>
          
        </div>) : (
          <div className='mt-2 text-lg'>
            No waist measurements for your inputs!
          </div>
        )
      }
      {!selectedMeasurement && height && weight && age &&
            <>
            <div className='flex flex-col w-2/12 mt-4'>
              <label>
                Couldn't find your waist size? Enter your waist measurement:
              </label>
              <input className='border mb-4 p-2 border-black rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 focus:outline-none' type="number" value={newMeasurement} onChange={e => setNewMeasurement(e.target.value)} />
            </div>
        <button className={`w-1/12 mt-4 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-black border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0 ${!newMeasurement && "opacity-50"}`} type="submit" onClick={(e) => handleNewSize(e)}>Add</button>
            </>
          }
    </div>
  );
}

export default App;