import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    onSnapshot,
  } from "firebase/firestore";
  import { db } from "../firebase";
import BookingCalender from './BookingCalender';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

const Booking = styled.div`
    border: 2px solid black;
    width: 50%;
    margin: 10px 0;
    padding: 10px;
`

const Players = styled.div`
    text-align: start;
`
const Player = styled.p`
    margin: 5px 0;
    
`
const PlayerList = styled.div`
    display: flex;
    align-items: center;
`
const Remove = styled.button`
    margin-left: 5px;
    font-size: small;
    border-radius: 0;
    display: flex;
    align-items: center;
`
const PlayerSelect = styled.select`
  padding: 10px;
`

const BookingSummary = () => {
    const [bookingData, setBookingData] = useState([]);
    const [playerData, setPlayerData] = useState([]);
    const [buttonClick, setButtonClick] = useState(false)
    const [newPlayer, setNewPlayer] = useState("")

    const handleBooking = (e) => {
        e.preventDefault()
        setButtonClick(buttonClick ? false : true)
    }
    useEffect(()=> {
        const unsub = onSnapshot(
            collection(db, "booking"),
            (snapShot) => {
              let list = [];
              snapShot.docs.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() });
              });
              setBookingData(list);
              
            },
            (error) => {
              console.log(error);
            }
          );
      
          return () => {
            unsub();
          };
        }, []);
    
        useEffect(()=> {
            const unsub = onSnapshot(
                collection(db, "players"),
                (snapShot) => {
                  let players = [];
                  snapShot.docs.forEach((doc) => {
                    players.push({ id: doc.id, ...doc.data() });
                  });
                  setPlayerData(players);
                  
                },
                (error) => {
                  console.log(error);
                }
              );
          
              return () => {
                unsub();
              };
            }, []);

            const handleDelete =  (id, index) => {
                try {
                    console.log(id + index)
                    
                  //await deleteDoc(doc(db, "booking", id));
                //   setData(data.filter((item) => item.id !== id));
                } catch (err) {
                  console.log(err);
                }
              };
console.log(bookingData)
  return (
    <div>
        <button onClick={handleBooking}>Add Booking</button>
        {buttonClick && <BookingCalender/>}
        {bookingData.map((data)=>(
            <Booking key={data.id}>
                <h3>{data.date}</h3>
                <Players>Players: {data.players.map((player, index)=>
                    <PlayerList>
                        <Player>{index+1}. {player}</Player>
                        <Remove onClick={()=>handleDelete(data.id, index)}>
                            <RemoveCircleIcon />
                            Remove
                        </Remove>
                    </PlayerList>
                    )}
                </Players>
                <label>Add a player: </label>
                <PlayerSelect onChange={((e)=>setNewPlayer(e.target.value))}>
                {playerData.map((data)=>(
                        <option value={data.name}>{data.name}</option>      
                ))}
                </PlayerSelect>
                <button>ADD</button>
            </Booking>
        ))}
        
        
    </div>
  )
}

export default BookingSummary