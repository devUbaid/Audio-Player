import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaTrashAlt } from 'react-icons/fa';

const useLocalStorage = (key, initialValue) => {
  const storedValue = localStorage.getItem(key);
  const initial = storedValue ? JSON.parse(storedValue) : initialValue;

  const [value, setValue] = useState(initial);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

const AudioPlayer = () => {
  const [playlist, setPlaylist] = useLocalStorage('playlist', []);
  const [currentTrackIndex, setCurrentTrackIndex] = useLocalStorage('currentTrackIndex', 0);
  const [currentTime, setCurrentTime] = useLocalStorage('currentTime', 0);

  const handleTimeUpdate = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  const handleAudioEnd = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  const handlePlay = () => {
    const audio = document.getElementById('audio-player');

    if (playlist.length > 0 && audio) {
      if (audio.paused || audio.ended) {
        audio.src = playlist[currentTrackIndex].url;
        audio.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
      }
    } else {
      console.error('Playlist is empty or audio element not found');
    }
  };

  const handlePause = () => {
    const audio = document.getElementById('audio-player');
    if (audio) {
      audio.pause();
    }
  };

  const playNextTrack = () => {
    if (currentTrackIndex < playlist.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    } else {
      setCurrentTrackIndex(0);
    }
  };

  const playPrevTrack = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    } else {
      setCurrentTrackIndex(playlist.length - 1);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    const newFiles = Array.from(files).map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setPlaylist([...playlist, ...newFiles]);
    setCurrentTrackIndex(0);
  };

  const clearPlaylist = () => {
    setPlaylist([]);
    setCurrentTrackIndex(0);
    setCurrentTime(0);
  };

  return (
    <div>
      <h1>Audio Player</h1>
      <input type="file" accept="audio/*" onChange={handleFileChange} multiple />
      <audio
        id="audio-player"
        controls
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnd}
        src={playlist[currentTrackIndex]?.url}
      ></audio>
      <div className='actionBtn'>
        <button onClick={handlePlay}><FaPlay /></button>
        <button onClick={handlePause}><FaPause /></button>
        <button onClick={playPrevTrack}><FaStepBackward /></button>
        <button onClick={playNextTrack}><FaStepForward /></button>
        
      </div>
      <div >
        <h2>Music Playlist</h2>
        <ul className='playlist'>
          {playlist.map((track, index) => (
            <li key={index} onClick={() => setCurrentTrackIndex(index)}>
              {index + 1}. {index === currentTrackIndex ? (
                <strong>{track.name}</strong>
              ) : (
                <span>{track.name}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <button className='plylistbtn' onClick={clearPlaylist}>Clear Playlist</button>
      <div>
        <h2>Now Playing</h2>
        <p>
          {playlist[currentTrackIndex]?.name} - {Math.floor(currentTime)} seconds
        </p>
      </div>
      <p className='owner'>Made By - Mohd Ubaidullah</p>
    </div>
  );
};

export default AudioPlayer;
