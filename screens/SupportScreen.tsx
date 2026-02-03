
import React, { useState } from 'react';
import { MessageCircle, ChevronRight, FileText, Send, X, Camera, ChevronDown } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { SupportTicket } from '../types';

const SupportScreen: React.FC = () => {
  const { tickets, addTicket } = useApp();
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isSubjectOpen, setIsSubjectOpen] = useState(false);

  const [form, setForm] = useState({
    subject: 'Вопросы по заказу',
    text: ''
  });

  const subjects = [
    'Вопросы по заказу', 
    'Вопросы по оплате', 
    'Техническая проблема', 
    'Проблемы с навигатором',
    'Обращение в свободной форме'
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.text.trim()) return;
    
    const newTicket: SupportTicket = {
      id: `SUP-${Math.floor(Math.random() * 9000) + 1000}`,
      date: new Date().toLocaleDateString('ru-RU'),
      createdAt: Date.now(),
      subject: form.subject,
      status: 'На рассмотрении',
      text: form.text
    };
    
    addTicket(newTicket);
    setForm({ subject: subjects[0], text: '' });
    setIsCreating(false);
  };

  const getStatusStyle = (status: string) => {
    if (status === 'Решено') return 'bg-green-100 text-gray-600';
    return 'bg-yellow-100 text-gray-600';
  };

  if (selectedTicket) {
    return (
      <div className="bg-white min-h-screen p-6">
        <button onClick={() => setSelectedTicket(null)} className="flex items-center gap-2 text-brand font-black text-xs uppercase tracking-widest mb-8">
          <ChevronRight className="rotate-180 w-5 h-5 stroke-[3]" /> Вернуться
        </button>
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
             <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded-lg text-[8.5px] font-black uppercase tracking-wider whitespace-nowrap overflow-hidden ${getStatusStyle(selectedTicket.status)}`}>
                  {selectedTicket.status}
                </span>
                <span className="text-[10px] font-black text-gray-300">#{selectedTicket.id}</span>
             </div>
             <h2 className="text-2xl font-black text-gray-800 leading-tight">{selectedTicket.subject}</h2>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
            <p className="text-gray-600 text-sm font-medium leading-relaxed">"{selectedTicket.text}"</p>
            <p className="text-[10px] text-gray-300 font-bold mt-4 uppercase">{selectedTicket.date}</p>
          </div>

          {selectedTicket.answer && (
             <div className="bg-brand-light/30 p-6 squircle border-2 border-brand/5 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2 mb-3">
                   <div className="w-2 h-4 bg-brand rounded-full"></div>
                   <p className="text-[10px] font-black text-brand uppercase tracking-widest">Агент поддержки</p>
                </div>
                <p className="text-gray-800 text-sm font-semibold leading-relaxed">{selectedTicket.answer}</p>
             </div>
          )}
        </div>
      </div>
    );
  }

  if (isCreating) {
    return (
      <div className="bg-white min-h-screen p-6 relative">
         <div className="relative flex justify-center items-center mb-10">
            <h2 className="text-xl font-black tracking-tight uppercase text-gray-800 text-center">Обращения в поддержку</h2>
            <button onClick={() => setIsCreating(false)} className="absolute right-0 p-2.5 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-gray-400" />
            </button>
         </div>
         <form onSubmit={handleCreate} className="space-y-10">
            <div className="space-y-4">
              <label className="text-[11px] font-black text-[#A0AFC7] uppercase tracking-[0.2em] px-2">ТЕМА</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsSubjectOpen(!isSubjectOpen)}
                  className="w-full bg-[#F8F9FB] rounded-[1.5rem] p-5 flex justify-between items-center border border-[#EDF2F7] transition-all active:scale-[0.98]"
                >
                  <span className="text-sm font-bold text-[#4A5B78]">
                    {form.subject}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-[#A0AFC7] transition-transform ${isSubjectOpen ? 'rotate-180' : ''}`} />
                </button>

                {isSubjectOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#EDF2F7] rounded-[1.5rem] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    {subjects.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setForm({...form, subject: s});
                          setIsSubjectOpen(false);
                        }}
                        className={`w-full text-left px-6 py-4 text-sm font-bold hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${
                          form.subject === s ? 'text-brand bg-brand-light/20' : 'text-[#4A5B78]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-black text-[#A0AFC7] uppercase tracking-[0.2em] px-2">ПОДРОБНОСТИ</label>
              <div className="relative">
                <textarea 
                  maxLength={500}
                  placeholder="Опишите ситуацию максимально подробно..."
                  rows={6}
                  value={form.text}
                  onChange={e => setForm({...form, text: e.target.value})}
                  className="w-full bg-[#F8F9FB] border border-[#EDF2F7] focus:border-brand/20 p-6 rounded-[2rem] text-sm font-bold text-[#4A5B78] placeholder-[#A0AFC7] outline-none transition-all resize-none"
                />
                <span className="absolute bottom-6 right-6 text-[10px] font-bold text-[#A0AFC7]">{form.text.length}/500</span>
              </div>
            </div>
            
            <button type="button" className="w-full flex items-center justify-center gap-2 text-brand text-xs font-black bg-[#FFF1F4] py-5 rounded-[1.5rem] active:scale-95 transition-all">
               <Camera className="w-5 h-5" /> ПРИКРЕПИТЬ ФОТО (до 10 фото)
            </button>

            <button 
              type="submit"
              disabled={!form.text.trim()}
              className="w-full bg-brand hover:bg-brand-dark disabled:bg-gray-100 disabled:text-gray-400 text-white font-black py-6 rounded-full shadow-2xl shadow-brand/30 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
            >
              <Send className="w-6 h-6" /> ОТПРАВИТЬ
            </button>
         </form>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tighter text-center">Обращения в поддержку</h1>
      </div>
      
      <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8 px-1 text-center">История обращений</h3>

      {tickets.length === 0 ? (
        <div className="bg-white squircle p-14 text-center shadow-sm border border-gray-50 flex flex-col items-center">
           <div className="w-24 h-24 bg-gray-50/50 rounded-full flex items-center justify-center mb-8">
              <MessageCircle className="w-10 h-10 text-gray-200" />
           </div>
           <p className="text-sm font-medium text-gray-400 leading-relaxed">
             Мы на связи 24/7. <br/> Если что-то не так — пишите.
           </p>
           <button 
             onClick={() => setIsCreating(true)}
             className="mt-10 bg-brand-light text-brand px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-sm active:scale-95 transition-all"
            >
              Создать обращение в поддержку
            </button>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map(ticket => (
            <div 
              key={ticket.id} 
              onClick={() => setSelectedTicket(ticket)}
              className="bg-white rounded-[2rem] p-5 shadow-sm active:scale-[0.98] transition-all flex items-center gap-4 cursor-pointer border border-transparent hover:border-brand/10 group"
            >
              <div className="bg-[#FFF1F4] p-4 rounded-[1.2rem] flex-shrink-0">
                <FileText className="w-6 h-6 text-brand" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-[15px] font-bold text-gray-600 truncate mb-1 whitespace-nowrap overflow-hidden">
                  {ticket.subject}
                </h4>
                <div className="flex items-center gap-2">
                  <span className={`text-[8.5px] font-black uppercase px-2 py-1 rounded-md tracking-wider whitespace-nowrap overflow-hidden ${getStatusStyle(ticket.status)}`}>
                    {ticket.status}
                  </span>
                  <span className="text-[10px] font-bold text-gray-300">
                    {ticket.date}
                  </span>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-brand transition-colors" />
            </div>
          ))}
          
          <div className="pt-8 flex justify-center pb-10">
            <button 
              onClick={() => setIsCreating(true)}
              className="bg-brand-light text-brand px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-sm active:scale-95 transition-all"
            >
              Создать обращение в поддержку
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportScreen;
