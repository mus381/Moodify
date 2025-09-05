import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import './FaceMoodDetector.css';

const FaceMoodDetector = React.memo(({ onMoodDetected }) => {
  const [isModelsLoading, setIsModelsLoading] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [detectedMood, setDetectedMood] = useState(null);
  const videoRef = useRef();
  
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setIsModelsLoading(false);
      } catch (error) {
        console.error("Failed to load face-api models:", error);
      }
    };
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraOn(true);
        }
      })
      .catch(err => console.error("Camera access error:", err));
  };
  
  const handleVideoPlay = () => {
    const detectionInterval = setInterval(async () => {
      if (videoRef.current && !videoRef.current.paused) {
        const detections = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        
        if (detections) {
          const expressions = detections.expressions;
          const dominantExpression = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
          
          setDetectedMood(dominantExpression);
          
          let mood;
          switch(dominantExpression) {
              case 'happy': mood = 'happy'; break;
              case 'sad': mood = 'sad'; break;
              case 'surprised': mood = 'workout'; break;
              default: mood = 'chill';
          }
          onMoodDetected(mood);
          
          clearInterval(detectionInterval);
          if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
          }
          setIsCameraOn(false);
        }
      } else {
        clearInterval(detectionInterval);
      }
    }, 500);
  };

  return (
    <div className="face-detector-container">
      <p>Or, let me see your face:</p>
      <button onClick={startVideo} disabled={isModelsLoading || isCameraOn} className="analyze-button">
        {isModelsLoading ? 'Loading AI...' : (isCameraOn ? 'Detecting...' : 'Start Camera')}
      </button>
      <div className="video-container">
        <video ref={videoRef} autoPlay muted onPlay={handleVideoPlay} playsInline></video>
      </div>
      {detectedMood && <p>Detected mood: {detectedMood}!</p>}
    </div>
  );
});

export default FaceMoodDetector;



