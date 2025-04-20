'use client';

import React, { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Cake = dynamic(() => import('./cake'), { ssr: false });

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    const getVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
      }
    };

    getVideo();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/png');
        setPhoto(imageData);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 to-purple-200 flex flex-col items-center justify-center overflow-hidden">
      {/* Main text */}
      <div className={`mt-20 transform transition-all duration-1000`}>
        <h1 className="text-6xl font-bold text-pink-600 p-4 mb-8">
          Happy Birthday! 🎉
        </h1>
      </div>

      {/* PhotoBooth */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8 rounded-xl shadow-lg mt-12">
        <h1 className="text-3xl font-bold mb-6">📸 PhotoBooth</h1>
        <video
          ref={videoRef}
          autoPlay
          className="w-full max-w-md rounded shadow-lg"
        />
        <button
          onClick={takePhoto}
          className="mt-4 px-6 py-2 bg-pink-600 rounded hover:bg-pink-500 transition"
        >
          Take Photo
        </button>
        <canvas ref={canvasRef} className="hidden" />
        {photo && (
          <div className="mt-6">
            <h2 className="text-xl mb-2">Your Photo:</h2>
            <img
              src={photo}
              alt="Captured"
              className="rounded shadow-lg max-w-md"
            />
          </div>
        )}
      </div>

      {/* Cake */}
      <div className={`w-screen transform transition-all duration-1000`}>
        <Cake />
      </div>
    </div>
  );
}
