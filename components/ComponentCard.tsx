import React from 'react';
import { Lock, Settings, Info } from 'lucide-react';
import { PCComponent, ComponentType } from '../types';

interface ComponentCardProps {
  component: PCComponent;
  isConfigurable: boolean;
  options?: PCComponent[];
  onSelect?: (component: PCComponent) => void;
}

export const ComponentCard: React.FC<ComponentCardProps> = ({ component, isConfigurable, options, onSelect }) => {
  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center p-4 border rounded-lg bg-white shadow-sm transition-all hover:shadow-md ${isConfigurable ? 'border-blue-200' : 'border-slate-200'}`}>
      
      {/* Icon/Image Section */}
      <div className="w-16 h-16 flex items-center justify-center bg-slate-50 rounded-lg text-slate-500 mb-3 sm:mb-0 sm:mr-4 shrink-0 overflow-hidden border border-slate-100 p-1">
        {component.image ? (
            <img src={component.image} alt={component.name} className="w-full h-full object-contain" />
        ) : (
            isConfigurable ? <Settings size={24} className="text-blue-500" /> : <Lock size={24} />
        )}
      </div>

      {/* Info Section */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{component.type}</span>
          {isConfigurable && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Customizable</span>}
        </div>
        
        {isConfigurable && options ? (
           <div className="mt-1">
             <select 
                className="w-full sm:w-auto mt-1 block border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-1.5 px-2 bg-slate-50 border"
                value={component.id}
                onChange={(e) => {
                  const selected = options.find(o => o.id === e.target.value);
                  if (selected && onSelect) onSelect(selected);
                }}
             >
               {options.map(opt => (
                 <option key={opt.id} value={opt.id}>
                   {opt.name} {opt.specs ? `(${opt.specs})` : ''} - ₹{opt.price.toLocaleString()}
                 </option>
               ))}
             </select>
           </div>
        ) : (
          <h4 className="text-sm font-semibold text-slate-900 truncate">{component.name}</h4>
        )}
        
        <p className="text-xs text-slate-500 mt-1">{component.specs}</p>
      </div>

      {/* Price/Trust Section */}
      <div className="mt-3 sm:mt-0 sm:ml-4 text-right shrink-0 w-full sm:w-auto flex flex-row sm:flex-col justify-between items-center sm:items-end">
        <span className="font-mono text-sm font-medium text-slate-700">₹{component.price.toLocaleString()}</span>
        {!isConfigurable && (
          <div className="flex items-center text-[10px] text-green-600 mt-1 bg-green-50 px-2 py-0.5 rounded-full">
             <span className="mr-1">●</span> Verified
          </div>
        )}
      </div>
    </div>
  );
};