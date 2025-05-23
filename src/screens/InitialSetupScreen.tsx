import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Header } from '../components/ui/header';

export const InitialSetupScreen: React.FC = () => {
  const navigate = useNavigate();
  const setChildInfo = useStore((state) => state.setChildInfo);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChildInfo({
      name,
      birthDate,
      ageLimit: 22, // Default age limit
    });
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5EA] to-[#FFE4E1]">
      <Header />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6 text-[#896b60]">
            Dear Time へようこそ
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#896b60] mb-2">
                お子様のお名前
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#896b60]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#896b60] mb-2">
                生年月日
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#896b60]"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#896b60] text-white py-2 rounded-md hover:bg-[#7a5c51] transition-colors"
            >
              始める
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};