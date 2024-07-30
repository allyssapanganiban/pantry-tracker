import React, { useRef, useState } from 'react';
import Camera from 'react-camera-pro';
import { Button } from '@mui/material';

const CameraComponent = ({ onCapture }) => {
  const cameraRef = useRef(null);
  const [image, setImage] = useState(null);

  const takePhoto = () => {
    const photo = cameraRef.current.takePhoto();
    setImage(photo);
    onCapture(photo);
  };

  return (
    <div>
      <Camera ref={cameraRef} aspectRatio={16 / 9} />
      <Button variant="contained" onClick={takePhoto}>
        Capture
      </Button>
      {image && <img src={image} alt="Captured" />}
    </div>
  );
};

export default CameraComponent;