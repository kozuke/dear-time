import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Header } from '../components/ui/header';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"

export const InitialSetupScreen: React.FC = () => {
  const navigate = useNavigate();
  const setChildInfo = useStore((state) => state.setChildInfo);
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');

  // 選択可能な最も古い生年月日（現在から22年前）を計算
  const getMinDate = () => {
    const today = new Date();
    return new Date(today.getFullYear() - 22, today.getMonth(), today.getDate());
  };

  // 年の選択肢を生成（現在の年から22年前まで）
  const years = Array.from(
    { length: 23 }, // 現在の年を含めて23年分
    (_, i) => {
      const year = new Date().getFullYear() - i;
      return { value: year.toString(), label: `${year}年` };
    }
  );

  // 月の選択肢を生成（年によって制限）
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return { value: month.toString().padStart(2, '0'), label: `${month}月` };
  }).filter(month => {
    if (!birthYear) return true;
    
    const selectedYear = parseInt(birthYear);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const minDate = getMinDate();
    
    // 現在の年が選択されている場合、現在の月までしか選択できない
    if (selectedYear === currentYear) {
      return parseInt(month.value) <= currentMonth;
    }
    
    // 22年前の年が選択されている場合、その月以降しか選択できない
    if (selectedYear === minDate.getFullYear()) {
      return parseInt(month.value) >= minDate.getMonth() + 1;
    }
    
    return true;
  });

  // 日の選択肢を生成（年月によって制限）
  const getDaysInMonth = (year: string, month: string) => {
    if (!year || !month) return 31;
    return new Date(parseInt(year), parseInt(month), 0).getDate();
  };

  const days = Array.from(
    { length: getDaysInMonth(birthYear, birthMonth) },
    (_, i) => {
      const day = i + 1;
      return { value: day.toString().padStart(2, '0'), label: `${day}日` };
    }
  ).filter(day => {
    if (!birthYear || !birthMonth) return true;
    
    const selectedDate = new Date(
      parseInt(birthYear),
      parseInt(birthMonth) - 1,
      parseInt(day.value)
    );
    const minDate = getMinDate();
    const today = new Date();
    
    // 選択された日付が許容範囲内かチェック
    return selectedDate >= minDate && selectedDate <= today;
  });

  // 月が変更されたときに日付をリセット
  useEffect(() => {
    setBirthDay('');
  }, [birthMonth]);

  // 年が変更されたときに月と日付をリセット
  useEffect(() => {
    setBirthMonth('');
    setBirthDay('');
  }, [birthYear]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (birthYear && birthMonth && birthDay) {
      const birthDate = `${birthYear}-${birthMonth}-${birthDay}`;
      const selectedDate = new Date(birthDate);
      const minDate = getMinDate();
      
      // 選択された日付が22年以上前でないことを確認
      if (selectedDate < minDate) {
        alert('22年以上前の生年月日は登録できません');
        return;
      }
      
      setChildInfo({
        name,
        birthDate,
        ageLimit: 22,
      });
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5EA] to-[#FFE4E1]">
      <Header />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6 text-[#896b60]">
            <span className="font-dancing">Dear Time</span> へようこそ
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
              <div className="flex gap-2">
                <Select value={birthYear} onValueChange={setBirthYear}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="年" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={birthMonth} onValueChange={setBirthMonth}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="月" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={birthDay} onValueChange={setBirthDay}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="日" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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