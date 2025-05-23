import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Card, CardContent } from '../components/ui/card';
import { Label } from '@radix-ui/react-label';
import { Header } from '../components/ui/header';

export const SettingsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { childInfo, setChildInfo, resetData } = useStore();
  const [name, setName] = useState(childInfo?.name || '');
  const [birthDate, setBirthDate] = useState(childInfo?.birthDate || '');
  const [ageLimit, setAgeLimit] = useState(childInfo?.ageLimit || 22);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChildInfo({
      name,
      birthDate,
      ageLimit,
    });
    navigate('/home');
  };

  const handleReset = () => {
    if (window.confirm('本当にデータをリセットしますか？')) {
      resetData();
      navigate('/setup');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5EA] to-[#FFE4E1]">
      <Header />
      <div className="py-8 px-4">
        <div className="max-w-md mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold text-[#896b60] mb-6 text-center">設定</h1>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#896b60]">お子様のお名前</Label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#896b60]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#896b60]">生年月日</Label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#896b60]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#896b60]">年齢上限</Label>
                  <input
                    type="number"
                    value={ageLimit}
                    onChange={(e) => setAgeLimit(Number(e.target.value))}
                    min="1"
                    max="100"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#896b60]"
                    required
                  />
                </div>

                <div className="pt-4 space-y-4">
                  <button
                    type="submit"
                    className="w-full bg-[#896b60] text-white py-2 rounded-md hover:bg-[#7a5c51] transition-colors"
                  >
                    保存
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full bg-white text-[#896b60] border border-[#896b60] py-2 rounded-md hover:bg-[#FFF5EA] transition-colors"
                  >
                    データをリセット
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};