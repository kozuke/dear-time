import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Card, CardContent } from '../components/ui/card';
import { Label } from '@radix-ui/react-label';
import { Header } from '../components/ui/header';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"

export const SettingsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { childInfo, setChildInfo, resetData } = useStore();
  const [name, setName] = useState(childInfo?.name || '');
  const [birthYear, setBirthYear] = useState(() => {
    if (childInfo?.birthDate) {
      const date = new Date(childInfo.birthDate);
      return date.getFullYear().toString();
    }
    return '';
  });
  const [birthMonth, setBirthMonth] = useState(() => {
    if (childInfo?.birthDate) {
      const date = new Date(childInfo.birthDate);
      return (date.getMonth() + 1).toString().padStart(2, '0');
    }
    return '';
  });
  const [birthDay, setBirthDay] = useState(() => {
    if (childInfo?.birthDate) {
      const date = new Date(childInfo.birthDate);
      return date.getDate().toString().padStart(2, '0');
    }
    return '';
  });

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

  // 初期値の設定
  useEffect(() => {
    if (childInfo?.birthDate) {
      const date = new Date(childInfo.birthDate);
      const minDate = getMinDate();
      
      // 保存されている生年月日が22年以上前の場合、値をクリア
      if (date < minDate) {
        setBirthYear('');
        setBirthMonth('');
        setBirthDay('');
      } else {
        setBirthYear(date.getFullYear().toString());
        // 月と日は1桁の場合でも必ず2桁になるようにpadStartを使用
        setBirthMonth((date.getMonth() + 1).toString().padStart(2, '0'));
        setBirthDay(date.getDate().toString().padStart(2, '0'));
      }
    } else {
      // childInfoがない場合は全てクリア
      setBirthYear('');
      setBirthMonth('');
      setBirthDay('');
    }
  }, [childInfo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (birthYear && birthMonth && birthDay) {
      // 月と日は必ず2桁になるようにpadStartを使用
      const formattedMonth = birthMonth.padStart(2, '0');
      const formattedDay = birthDay.padStart(2, '0');
      const birthDate = `${birthYear}-${formattedMonth}-${formattedDay}`;
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