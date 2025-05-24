import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Settings } from "lucide-react";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const showSettings = location.pathname !== '/settings';

  return (
    <header className="items-center justify-between px-10 py-3 flex-[0_0_auto] border-b border-[#E8D5D0] flex relative self-stretch w-full bg-white/80 backdrop-blur-sm">
      <div className="inline-flex items-center gap-4 relative flex-[0_0_auto]">
        <h1 className="font-bold text-[#896b60] text-lg tracking-[0] leading-[23px] whitespace-nowrap font-sans flex items-center gap-2">
          <img src="/dear_time_logomain.svg" alt="Dear Time Main" className="h-10 w-auto" />
          <img src="/dear_time_logo_trimmed_vertical_only.svg" alt="Dear Time" className="h-10 w-auto" />
        </h1>
      </div>
      {showSettings && (
        <button
          onClick={() => navigate('/settings')}
          className="p-2 rounded-full hover:bg-[#FFF5EA] transition-colors"
        >
          <Settings className="w-6 h-6 text-[#896b60]" />
        </button>
      )}
    </header>
  );
};