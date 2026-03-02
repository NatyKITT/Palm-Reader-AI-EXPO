'use client';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {motion} from 'framer-motion';
import {Camera, Upload} from 'lucide-react';
import Webcam from 'react-webcam';

interface FileUploadProps {
  onUploadComplete: (imageBase64: string) => void;
}

const MAX_SIZE_PX = 1200;

function resizeImageToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let {width, height} = img;
      if (width > MAX_SIZE_PX || height > MAX_SIZE_PX) {
        if (width > height) {
          height = Math.round((height * MAX_SIZE_PX) / width);
          width = MAX_SIZE_PX;
        } else {
          width = Math.round((width * MAX_SIZE_PX) / height);
          height = MAX_SIZE_PX;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context failed'));
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = url;
  });
}

const FileUpload: React.FC<FileUploadProps> = ({onUploadComplete}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const uploadSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stepBoxes = document.querySelectorAll('.step_box');
    stepBoxes.forEach(step => {
      step.addEventListener('click', () => {
        uploadSectionRef.current?.scrollIntoView({behavior: 'smooth'});
      });
    });
  }, []);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || '';
    setIsIOS(/iPhone|iPad|iPod/i.test(userAgent));
  }, []);

  const processFile = useCallback(async (file: File | Blob) => {
    try {
      setIsProcessing(true);
      const base64 = await resizeImageToBase64(file);
      onUploadComplete(base64);
    } catch (error) {
      console.error('Chyba při zpracování obrázku:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [onUploadComplete]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processFile(file);
  };

  const handleButtonClick = () => fileInputRef.current?.click();

  const handleWebcamCapture = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      const blob = await fetch(imageSrc).then(res => res.blob());
      await processFile(blob);
      setIsWebcamOpen(false);
    }
  }, [processFile]);

  return (
    <div ref={uploadSectionRef} className="fileupload_wrapper">
      <div className="tip-box">
        📸 <strong>Doporučení:</strong> Pro nejlepší výsledek nahrajte nebo vyfoťte svou{' '}
        <strong>levou dlaň</strong> a doplňte datum narození a jméno.
      </div>

      {!isWebcamOpen ? (
        <motion.div className="fileupload_box" whileTap={{scale: 0.98}}>
          {isIOS && (
            <>
              <input type="file" accept="image/*" capture="environment"
                onChange={handleFileChange} ref={fileInputRef}
                className="fileupload_input" style={{display: 'none'}} />
              <button className="btn_bordered fileupload_btn btn-width" onClick={handleButtonClick} disabled={isProcessing}>
                {isProcessing ? 'Zpracovávám...' : 'Vyfotit'} <Camera className="icon_svg"/>
              </button>
            </>
          )}
          {!isIOS && (
            <>
              <input type="file" onChange={handleFileChange}
                className="fileupload_input" ref={fileInputRef}
                accept="image/*" style={{display: 'none'}} />
              <button className="btn_fill fileupload_btn btn-width" onClick={handleButtonClick} disabled={isProcessing}>
                {isProcessing ? 'Zpracovávám...' : 'Nahrát obrázek'} <Upload className="icon_svg"/>
              </button>
              <button className="btn_bordered fileupload_btn btn-width" onClick={() => setIsWebcamOpen(true)} disabled={isProcessing}>
                Vyfotit <Camera className="icon_svg"/>
              </button>
            </>
          )}
        </motion.div>
      ) : (
        <div className="fileupload_webcam">
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg"
            className="fileupload_camera" videoConstraints={{facingMode: 'environment'}} />
          <div className="fileupload_actions">
            <button className="btn_fill btn-width" onClick={handleWebcamCapture}>Vyfotit</button>
            <button className="btn_bordered btn-width" onClick={() => setIsWebcamOpen(false)}>Zrušit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
