// src/components/common/FilterBar.jsx
import React from 'react';
import { Calendar, Filter, Search } from 'lucide-react';
import Button from './Button';

const FilterBar = ({ 
  register,
  watch,
  errors,
  branches = [],
  showReportType = true,
  showBranch = true
}) => {
  const dateRange = watch('dateRange');

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-wrap gap-4 items-end justify-between border border-outline-variant/10 animate-fadeIn">
      <div className="flex flex-wrap gap-4 flex-1">
        {showReportType && (
          <div className="flex flex-col gap-1.5 w-full sm:w-auto">
            <label className="text-[10px] font-medium uppercase tracking-widest text-on-surface-variant/60 ml-1">Report Type</label>
            <select 
              {...register('reportType')}
              className={`bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 py-2.5 px-4 text-sm font-medium outline-none min-w-[200px] cursor-pointer ${errors?.reportType ? 'ring-2 ring-error/50' : ''}`}
            >
              <option value="allocations">Allocations</option>
              <option value="batches">Batches</option>
              <option value="inventory">Inventory</option>
              <option value="slaughter">Slaughter</option>
              <option value="processing">Processing</option>
            </select>
          </div>
        )}

        <div className="flex flex-col gap-1.5 w-full sm:w-auto">
            <label className="text-[10px] font-medium uppercase tracking-widest text-on-surface-variant/60 ml-1">Date Range</label>
          <select 
            {...register('dateRange')}
            className="bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 py-2.5 px-4 text-sm font-medium outline-none min-w-[150px] cursor-pointer"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {dateRange === 'custom' && (
          <>
            <div className="flex flex-col gap-1.5 w-full sm:w-auto">
              <label className="text-[10px] font-medium uppercase tracking-widest text-on-surface-variant/60 ml-1">Start Date</label>
              <input 
                type="date" 
                {...register('startDate')}
                className={`bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 py-2.5 px-4 text-sm font-medium outline-none ${errors?.startDate ? 'ring-2 ring-error/50' : ''}`} 
              />
              {errors?.startDate && <p className="text-[10px] text-error mt-0.5 ml-1">{errors.startDate.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5 w-full sm:w-auto">
              <label className="text-[10px] font-medium uppercase tracking-widest text-on-surface-variant/60 ml-1">End Date</label>
              <input 
                type="date" 
                {...register('endDate')}
                className={`bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 py-2.5 px-4 text-sm font-medium outline-none ${errors?.endDate ? 'ring-2 ring-error/50' : ''}`} 
              />
              {errors?.endDate && <p className="text-[10px] text-error mt-0.5 ml-1">{errors.endDate.message}</p>}
            </div>
          </>
        )}

        {showBranch && (
          <div className="flex flex-col gap-1.5 w-full sm:w-auto">
            <label className="text-[10px] font-medium uppercase tracking-widest text-on-surface-variant/60 ml-1">Branch Name</label>
            <select 
              {...register('branchFilter')}
              className="bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 py-2.5 px-4 text-sm font-medium outline-none min-w-[180px] cursor-pointer"
            >
              <option value="">All Branches</option>
              {branches?.map(b => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <Button 
        type="submit"
        icon={Filter}
        size="md"
        className="self-end"
      >
        Apply Filters
      </Button>
    </div>
  );
};

export default FilterBar;
