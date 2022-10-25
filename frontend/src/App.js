import './App.css';
import axios from 'axios'
import { useState, useEffect } from 'react';
import { Card } from '@mui/material'

const instance = axios.create({
  baseURL: "http://localhost:8080"
})

function App() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAlbums = async() => {
      await instance.get("/api/getArtistTracks", { params: {artistName: "JayChou"}}).then((res) =>  {
          setLoading(false); 
          setAlbums(res.data);
        }
      )
      console.log("Fetch success");
    }
    fetchAlbums();
  }, [])
  return (
    loading ? <p>Loading</p> :
    <Card>
      {albums.map((e) => <>
        <Card>{e.name}</Card>
        <Card>{e.tracks.map((f) => <>
          <Card>{f.name}</Card>
          <Card>{f.playcount}</Card>
        </>)}</Card>
      </>)}
    </Card>
  );
}

export default App;
