// import { useEffect, useRef, useState } from "react";
// import { createContext } from "react";
// import { songsData } from "../assets/assets";

// export const PlayerContext= createContext();

// const PlayerContextProvider=(props) =>{

//     const audioRef=useRef();
//     const seekBg=useRef();
//     const seekBar=useRef();

//     const [track,setTrack]=useState(songsData[0]);
//     const [playStatus,setPlayStatus]=useState(false);
//     const [time,setTime]=useState({
//         currentTime:{
//             second:0,
//             minute:0
//         },
//         totalTime:{
//             second:0,
//             minute:0
//         }
//     })

//     const play=()=>{
//         audioRef.current.play();
//         setPlayStatus(true);
//     }

//     const pause=()=>{
//         audioRef.current.pause();
//         setPlayStatus(false);
//     }

//     const playWithId=async()=>{
//         await setTrack(songsData[id]);
//         await audioRef.current.play();
//         setPlayStatus(true);
//     }



//     useEffect(()=>{
//         setTimeout(()=>{
//             audioRef.current.ontimeupdate=()=>{
//                 seekBar.current.style.width=(Math.floor(audioRef.current.currentTime/audioRef.current.duration*100))+"%"
//                 setTime({
//                     currentTime:{
//                         second:Math.floor(audioRef.current.currentTime%60),
//                         minute:Math.floor(audioRef.current.currentTime/60)
//                     },
//                     totalTime:{
//                         second:Math.floor(audioRef.current.duration%60),
//                         minute:Math.floor(audioRef.current.duration/60)
//                     }
//                 })
//             }
//         }, 1000)
//     },[audioRef])

//     const contextValue={
//         audioRef,
//         seekBg,
//         seekBar,
//         track,
//         setTrack,
//         playStatus,
//         setPlayStatus,
//         time,
//         setTime,
//         play,pause,
//         playWithId
//     }

//     return (
//         <PlayerContext.Provider value={contextValue}>
//             {props.children}
//         </PlayerContext.Provider>
//     )
// }

// export default PlayerContextProvider;

import { useEffect, useRef, useState, createContext } from "react";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
    const audioRef = useRef(null);
    const seekBg = useRef(null);
    const seekBar = useRef(null);

    const [track, setTrack] = useState(songsData[0]);
    const [playStatus, setPlayStatus] = useState(false);
    const [time, setTime] = useState({
        currentTime: { second: 0, minute: 0 },
        totalTime: { second: 0, minute: 0 }
    });

    const play = () => {
        if (audioRef.current) {
            audioRef.current.play();
            setPlayStatus(true);
        }
    };

    const pause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setPlayStatus(false);
        }
    };

    const playWithId = (id) => {
        setTrack(songsData[id]);
        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.play();
                setPlayStatus(true);
            }
        }, 0);
    };

    const previous=async ()=>{
        if (track.id>0){
            await setTrack(songsData[track.id-1]);
            await audioRef.current.play();
            setPlayStatus(true);
        }
    }

    const next=async ()=>{
        if (track.id<songsData.length-1){
            await setTrack(songsData[track.id+1]);
            await audioRef.current.play();
            setPlayStatus(true);
        }
    }

    const seekSong=async(e)=>{
        audioRef.current.currentTime=((e.nativeEvent.offsetX / seekBg.current.offsetWidth)*audioRef.current.duration)
    }


    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onTimeUpdate = () => {
            if (seekBar.current && audio.duration) {
                seekBar.current.style.width = (Math.floor(audio.currentTime / audio.duration * 100)) + "%";
            }
            setTime({
                currentTime: {
                    second: Math.floor(audio.currentTime % 60),
                    minute: Math.floor(audio.currentTime / 60)
                },
                totalTime: {
                    second: Math.floor(audio.duration % 60),
                    minute: Math.floor(audio.duration / 60)
                }
            });
        };

        audio.ontimeupdate = onTimeUpdate;

        return () => {
            audio.ontimeupdate = null;
        };
    }, []);

    const contextValue = {
        audioRef,
        seekBg,
        seekBar,
        track,
        setTrack,
        playStatus,
        setPlayStatus,
        time,
        setTime,
        play,
        pause,
        playWithId,
        previous,next,
        seekSong
    };

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    );
};

export default PlayerContextProvider;
