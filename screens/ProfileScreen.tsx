
import React from 'react';
import { MapPin, ShieldCheck, ChevronRight } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { CourierStatus } from '../types';

const ProfileScreen: React.FC = () => {
  const { profile, courierStatus } = useApp();

  const isInCFZ = courierStatus === CourierStatus.IN_CFZ;

  return (
    <div className="p-6">
      <div className="bg-white squircle shadow-sm p-8 flex flex-col items-center text-center mb-6 border border-gray-50">
        {/* Avatar with Gradient Border and Shield */}
        <div className="relative mb-6">
          <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-[#FA3D67] to-[#FF8FA7]">
            <img 
              src={profile.photo} 
              alt={profile.name} 
              className="w-full h-full rounded-full border-4 border-white shadow-sm object-cover" 
            />
          </div>
          <div className="absolute bottom-1 right-1 bg-[#FA3D67] border-[3px] border-white w-8 h-8 rounded-full flex items-center justify-center shadow-md">
             <ShieldCheck className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Name and Partner Status */}
        <h1 className="text-2xl font-black text-[#1A1C1E] tracking-tight mb-1">
          {profile.name}
        </h1>
        <p className="text-[#94A3B8] text-sm font-medium mb-6">
          Курьер-партнер
        </p>
        
        {/* Status Badge */}
        <div className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
          isInCFZ 
            ? 'bg-green-500 text-white shadow-lg shadow-green-100' 
            : 'bg-gray-100 text-gray-700 border border-gray-200'
        }`}>
          {courierStatus}
        </div>
      </div>

      {/* Info Cards */}
      <div className="space-y-3">
        <div className="bg-white rounded-3xl shadow-sm p-5 flex items-center gap-4 border border-gray-50 transition-all active:scale-[0.98]">
          <div className="bg-gray-100 p-3 rounded-2xl">
            <MapPin className="w-6 h-6 text-gray-400" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Базовый ЦФЗ</h3>
            <p className="text-sm font-bold text-gray-700 leading-tight">{profile.cfzAddress}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-200" />
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-5 flex items-center gap-4 border border-gray-100 opacity-60">
           <div className="bg-gray-50 p-3 rounded-2xl">
              <div className="w-6 h-6 border-2 border-gray-300 rounded-lg flex items-center justify-center text-[10px] font-black text-gray-300">%</div>
           </div>
           <div className="flex-1 text-left">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Статистика смены</h3>
              <p className="text-sm font-bold text-gray-400">В разработке</p>
           </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-12 text-center flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-brand squircle flex items-center justify-center p-2 shadow-lg shadow-brand/20">
            <div className="w-full h-full bg-white rounded-full relative overflow-hidden">
                <div className="absolute inset-0 bg-brand rounded-full transform scale-[0.45] translate-x-1"></div>
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-white"></div>
            </div>
        </div>
        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">Версия v0.2.1 • MVP Edition</p>
      </div>
    </div>
  );
};

export default ProfileScreen;
