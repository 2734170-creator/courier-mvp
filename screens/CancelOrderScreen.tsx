
import React, { useState } from 'react';
// @ts-ignore - Fixing "Module 'react-router-dom' has no exported member" errors
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { CANCEL_REASONS } from '../constants';

const CancelOrderScreen: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cancelOrder } = useApp();
  const [reason, setReason] = useState<string>('');
  const [otherText, setOtherText] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleCancel = () => {
    if (!id || !reason) return;
    const finalReason = reason === 'Другое' ? `Другое: ${otherText}` : reason;
    cancelOrder(id, finalReason);
    navigate('/deliveries');
  };

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-xl font-black text-gray-800 uppercase tracking-tighter">Отмена доставки</h1>
      </div>

      <h3 className="text-[11px] font-black text-[#A0AFC7] uppercase tracking-[0.2em] mb-4 px-2">ВЫБЕРИТЕ ПРИЧИНУ</h3>
      
      <div className="relative mb-6">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full bg-[#F8F9FB] rounded-[1.5rem] p-5 flex justify-between items-center border border-[#EDF2F7] transition-all active:scale-[0.98]"
        >
          <span className={`text-sm font-bold ${reason ? 'text-[#4A5B78]' : 'text-[#A0AFC7]'}`}>
            {reason || 'Выберите из списка...'}
          </span>
          <ChevronDown className={`w-5 h-5 text-[#A0AFC7] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#EDF2F7] rounded-[1.5rem] shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
            {CANCEL_REASONS.map((r) => (
              <button
                key={r}
                onClick={() => {
                  setReason(r);
                  setIsDropdownOpen(false);
                }}
                className={`w-full text-left px-6 py-4 text-sm font-bold hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${
                  reason === r ? 'text-brand bg-brand-light/20' : 'text-[#4A5B78]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>

      {reason === 'Другое' && (
        <div className="mb-8 animate-in zoom-in-95 duration-200">
           <textarea
             placeholder="Укажите свою причину..."
             className="w-full bg-[#F8F9FB] border border-[#EDF2F7] rounded-[1.5rem] p-5 text-sm font-bold text-[#4A5B78] outline-none focus:border-brand/30 min-h-[100px] resize-none"
             value={otherText}
             onChange={(e) => setOtherText(e.target.value)}
           />
        </div>
      )}

      <button
        disabled={!reason || (reason === 'Другое' && !otherText.trim())}
        onClick={handleCancel}
        className={`w-full py-6 rounded-full font-black text-lg transition-all shadow-2xl flex items-center justify-center gap-2 ${
          reason && (reason !== 'Другое' || otherText.trim()) 
            ? 'bg-gray-900 text-white shadow-gray-200 active:scale-95' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
        }`}
      >
        <span className="uppercase tracking-tight">ПОДТВЕРДИТЬ ОТМЕНУ</span>
      </button>
    </div>
  );
};

export default CancelOrderScreen;
