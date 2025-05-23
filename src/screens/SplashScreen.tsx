import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const childInfo = useStore((state) => state.childInfo);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(childInfo ? '/home' : '/setup');
    }, 2000);

    return () => clearTimeout(timer);
  }, [childInfo, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5EA] to-[#FFE4E1] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#896b60] mb-4">Dear Time</h1>
        <p className="text-[#896b60]">大切な時間を、もっと大切に</p>
      </div>
    </div>
  );
};