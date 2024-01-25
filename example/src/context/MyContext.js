import React from 'react';
import {createContext, useState, useContext} from 'react';

const MyContext = createContext();

export const MyProvider = ({children}) => {
  const [startRecording, setStartRecording] = useState(false);
  const [isPaused, setPaused] = useState(false);
  const [screenshotUri, setScreenshotUri] = useState('');

  const startRecordingMethod = state => {
    setStartRecording(state);
  };

  const pauseRecordingMethod = state => {
    setPaused(state);
  };

  const screenshotMethod = uri => {
    setScreenshotUri(uri);
  };

  return (
    <MyContext.Provider
      value={{
        startRecording,
        startRecordingMethod,
        isPaused,
        pauseRecordingMethod,
        screenshotUri,
        screenshotMethod,
      }}>
      {children}
    </MyContext.Provider>
  );
};

// Create a custom hook to use the context
export const useMyContext = () => {
  return useContext(MyContext);
};
