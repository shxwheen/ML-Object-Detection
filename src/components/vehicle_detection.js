import React, { useRef, useState, useEffect } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

const VehicleDetection = () => {
  const videoRef = useRef(null); // Ref to the video element
  const [vehicleCount, setVehicleCount] = useState(0); // Vehicle count state
  const [personCount, setPersonCount] = useState(0); // Person count state
  const [model, setModel] = useState(null); // TensorFlow model state

  // Load the COCO SSD model when the component mounts
  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
      console.log('COCO SSD Model Loaded');
    };
    loadModel();
  }, []);

  // Start the webcam feed when the component mounts
  useEffect(() => {
    const startWebcam = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    };
    startWebcam();
  }, []);

  // Run the vehicle and person detection
  useEffect(() => {
    const detectObjects = async () => {
      if (model && videoRef.current) {
        const predictions = await model.detect(videoRef.current);
        
        // Filter out vehicle and person predictions
        const vehicles = predictions.filter(
          (p) => p.class === 'car' || p.class === 'truck'
        );
        const people = predictions.filter((p) => p.class === 'person');

        // Update state with counts
        setVehicleCount(vehicles.length); 
        setPersonCount(people.length);
      }
    };

    // Run detection every second
    const interval = setInterval(() => {
      detectObjects();
    }, 1000);

    // Clean up the interval when component unmounts
    return () => clearInterval(interval);
  }, [model]);

  return (
    <div>
      <h1>Object Detection</h1>
      <video ref={videoRef} autoPlay muted width="640" height="480"></video>
      <p>Vehicles Detected: {vehicleCount}</p>
      <p>People Detected: {personCount}</p>
    </div>
  );
};

export default VehicleDetection;
