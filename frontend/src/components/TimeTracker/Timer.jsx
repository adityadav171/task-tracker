import React, { useState, useEffect, useRef } from 'react';
import { timelogAPI } from '../../services/api';
import './Timer.css';

function Timer({ taskId, isActive, onStart, onUpdate }) {
  const [seconds, setSeconds] = useState(0);
  const logIdRef = useRef(null); // Use ref instead of state
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  const handleStart = async () => {
    try {
      const { data } = await timelogAPI.start(taskId);
      logIdRef.current = data.id; // Store in ref
      setSeconds(0);
      onStart();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to start timer');
    }
  };

  const handleStop = async () => {
    if (!logIdRef.current) {
      alert('No active timer found');
      return;
    }

    try {
      await timelogAPI.stop(logIdRef.current);
      setSeconds(0);
      logIdRef.current = null; // Clear ref
      onUpdate();
    } catch (error) {
      console.error('Stop timer error:', error);
      alert('Failed to stop timer');
    }
  };

  const formatTime = (secs) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer">
      {isActive && <span className="timer-display">{formatTime(seconds)}</span>}
      {isActive ? (
        <button onClick={handleStop} className="stop-btn">Stop</button>
      ) : (
        <button onClick={handleStart} className="start-btn">Start</button>
      )}
    </div>
  );
}

export default Timer;
