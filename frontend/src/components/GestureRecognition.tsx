import React, { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import * as mp from "@mediapipe/hands";
import Webcam from "react-webcam";

type Props = {
    onGestureDetected: (difficulty: string) => void;
  };

const GestureRecognition: React.FC<Props> = ({ onGestureDetected }) => {
  const webcamRef = useRef<Webcam>(null);
  const [gesture, setGesture] = useState<string | null>(null);
  const lastGestureRef = useRef<string | null>(null);
  const cooldownRef = useRef(false);

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.8,
      minTrackingConfidence: 0.8,
    });

    hands.onResults(onResults);

    if (webcamRef.current?.video) {
      const camera = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          if (webcamRef.current?.video) {
            await hands.send({ image: webcamRef.current.video });
          }
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, []);

  const onResults = (results: mp.Results) => {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) return;

    const landmarks = results.multiHandLandmarks[0];

    const recognized = recognizeGesture(landmarks);

    // Avoid spamming the parent with the same gesture
    if (recognized && recognized !== lastGestureRef.current && !cooldownRef.current) {
      lastGestureRef.current = recognized;
      setGesture(recognized);
      onGestureDetected(recognized);

      cooldownRef.current = true;
      setTimeout(() => {
        cooldownRef.current = false;
      }, 2000); // Cooldown to prevent repeated triggers
    }
  };

  const recognizeGesture = (landmarks: mp.NormalizedLandmarkList): string | null => {
    const getY = (i: number) => landmarks[i].y;
    const getX = (i: number) => landmarks[i].x;

    // Calculate relative finger positions
    const thumbIsUp = getY(4) < getY(3) && getX(4) < getX(3);
    const thumbIsDown = getY(4) > getY(3);
    const indexExtended = getY(8) < getY(6);
    const middleExtended = getY(12) < getY(10);
    const ringExtended = getY(16) < getY(14);
    const pinkyExtended = getY(20) < getY(18);

    const extendedFingers = [indexExtended, middleExtended, ringExtended, pinkyExtended].filter(Boolean).length;

    // Thumb Up
    if (thumbIsUp && extendedFingers === 0) return "Easy";

    // Peace ✌️
    if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) return "Medium";

    // Thumb Down
    if (thumbIsDown && extendedFingers === 0) return "Hard";

    // Fist
    if (!indexExtended && !middleExtended && !ringExtended && !pinkyExtended) return "Wrong";

    return null;
  };

  return (
    <div>
      <Webcam
        ref={webcamRef}
        videoConstraints={{ width: 100, height: 100, facingMode: "user" }}
        style={{ width: "100%", paddingTop: "10px", maxWidth: "300px", maxHeight: "300px" }}
      />
      {gesture && <p>Detected Gesture: <strong>{gesture}</strong></p>}
    </div>
  );
    
};

export default GestureRecognition;
