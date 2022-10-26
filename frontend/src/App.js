import './App.css';
import axios from 'axios'
import { useState, useEffect } from 'react';
import { Card, Input, Button, Grid } from '@mui/material'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const instance = axios.create({
  baseURL: "http://localhost:8080"
})

function App() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [artistName, setArtistName] = useState("");
  const [songs, setSongs] = useState([]);
  const [limit, setLimit] = useState(10);
  const fetchAlbums = async() => {
    setLoading(true);
    await instance.get("/api/getArtistTracks", { params: {artistName: artistName}}).then((res) =>  {
        setLoading(false); 
        setAlbums(res.data);
        setSongs(res.data.map((e) => e.tracks.map((f) => {
          return {
            name: f.name, 
            playcount: f.playcount,
            album: e.name
          }
        })).flat().sort((a, b) => b.playcount - a.playcount));
        
      }
    )
    console.log("Fetch success");
  }

  return (
    <>
      <Grid display={"flex"} justifyContent="space-between" alignItems={"center"} sx={{width: "100%", padding: "12px"}}>
        <img width={"150px"} src='https://spotify-artist-playcount-ranking.s3.amazonaws.com/Spotify_Logo_RGB_Green.png'></img>
        <div style={{flexGrow: 1, display: "flex", justifyContent: "center"}}>
          <Input sx={{width: "80%", padding: "8px"}} value={artistName} onChange={(e) => setArtistName(e.target.value)}></Input>
          <Button onClick={() => fetchAlbums()}>搜尋</Button>
        </div>
      </Grid>
      { loading ? <p>Loading...</p>
        :
        <>
          <TableContainer component={Paper} sx={{ width: "760px", margin: "auto" }}>
            <Table  aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>專輯名稱</TableCell>
                  <TableCell>曲目</TableCell>
                  <TableCell>播放次數</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {songs.filter((_, i) => i < limit).map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row"><Card sx={{background: "#F7F9FA", color: "#202325", padding: "8px", width: "50%", textAlign: "center", fontSize: "16px"}}>{row.album}</Card></TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.playcount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button onClick={() => setLimit(limit+10)}>增加10筆資料</Button>
        </>
      }
    </>
  );
}

export default App;
