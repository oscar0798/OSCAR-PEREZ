import React, { useState } from 'react';
import { ApprenticeProfile } from '../types/sena';
import { SENA_REGIONAL_OPTIONS, SENA_PROGRAMS_SAMPLE } from '../data/senaData';
import { X, User, Check, Building, FileSpreadsheet } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ApprenticeProfile;
  onSave: (updated: ApprenticeProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave
}) => {
  const [formData, setFormData] = useState<ApprenticeProfile>({ ...profile });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.documentNumber.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#007832] dark:text-emerald-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Datos del Aprendiz SENA</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Estos datos aparecerán en tu Certificado Oficial de Inducción</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Full Name */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nombre Completo del Aprendiz</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-transparent"
              placeholder="Ej. Juan Camilo Pérez Rodríguez"
            />
          </div>

          {/* Document Type & Number */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Tipo Doc.</label>
              <select
                value={formData.documentType}
                onChange={e => setFormData({ ...formData, documentType: e.target.value as any })}
                className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
              >
                <option value="CC">C.C.</option>
                <option value="TI">T.I.</option>
                <option value="CE">C.E.</option>
                <option value="PPT">P.P.T.</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Número de Identificación</label>
              <input
                type="text"
                required
                value={formData.documentNumber}
                onChange={e => setFormData({ ...formData, documentNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                placeholder="1020304050"
              />
            </div>
          </div>

          {/* Training Program */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Programa de Formación</label>
            <input
              type="text"
              list="sena-programs"
              required
              value={formData.trainingProgram}
              onChange={e => setFormData({ ...formData, trainingProgram: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#39A900]"
              placeholder="Selecciona o escribe tu programa"
            />
            <datalist id="sena-programs">
              {SENA_PROGRAMS_SAMPLE.map(prog => (
                <option key={prog} value={prog} />
              ))}
            </datalist>
          </div>

          {/* Ficha & Regional */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Número de Ficha</label>
              <div className="relative">
                <FileSpreadsheet className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={formData.ficheNumber}
                  onChange={e => setFormData({ ...formData, ficheNumber: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                  placeholder="2874910"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Regional SENA</label>
              <select
                value={formData.regional}
                onChange={e => setFormData({ ...formData, regional: e.target.value })}
                className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
              >
                {SENA_REGIONAL_OPTIONS.map(reg => (
                  <option key={reg} value={reg}>{reg}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Center */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Centro de Formación</label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={formData.trainingCenter}
                onChange={e => setFormData({ ...formData, trainingCenter: e.target.value })}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                placeholder="Centro de Gestión de Mercados, Logística y TIC"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#39A900] hover:bg-[#2d8500] text-white font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-4 h-4" />
              Guardar y Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
