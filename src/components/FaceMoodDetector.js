import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import './FaceMoodDetector.css';

const FaceMoodDetector = React.memo(({ onMoodDetected }) => {
  const [isModelsLoading, setIsModelsLoading] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [detectedMood, setDetectedMood] = useState(null);
  const videoRef = useRef();
  // The unused canvasRef has been removed.

  // Load AI models on component mount
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models'; // This path is now correct
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
      setIsModelsLoading(false);
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
      .catch(err => {
        console.error("Error accessing webcam:", err);
        alert("Could not access the webcam. Please ensure you have a webcam connected and have granted permission.");
      });
  };
  
  const handleVideoPlay = () => {
    const detectionInterval = setInterval(async () => {
      if (videoRef.current && !videoRef.current.paused) {
        const detections = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        
        if (detections && detections.expressions) {
          const expressions = detections.expressions;
          const dominantExpression = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
          
          setDetectedMood(dominantExpression);
          
          let mood;
          switch(dominantExpression) {
              case 'happy':
                  mood = 'happy';
                  break;
              case 'sad':
                  mood = 'sad';
                  break;
              case 'surprised':
                  mood = 'workout'; // High energy
                  break;
              default:
                  mood = 'chill';
          }

          onMoodDetected(mood);
          
          clearInterval(detectionInterval);
          if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            setIsCameraOn(false);
          }
        }
      }
    }, 500); // Increased interval slightly for better performance
  };

  return (
    <div className="face-detector-container">
      <p>Or, let me see your face:</p>
      <button onClick={startVideo} disabled={isModelsLoading || isCameraOn} className="analyze-button">
        {isModelsLoading ? 'Loading AI...' : (isCameraOn ? 'Detecting...' : 'Start Camera')}
      </button>
      <div className="video-container">
        <video ref={videoRef} autoPlay muted onPlay={handleVideoPlay} style={{ transform: 'scaleX(-1)' }}></video>
      </div>
      {detectedMood && <p className="detected-mood-text">I see you're feeling {detectedMood}!</p>}
    </div>
  );
});

export default FaceMoodDetector;
