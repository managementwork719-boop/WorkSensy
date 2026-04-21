import React from 'react';

export const Skeleton = ({ className, variant = 'rect' }) => {
  const baseClass = "bg-slate-200/50 relative overflow-hidden";
  const variantClasses = {
    rect: "rounded-[24px]",
    circle: "rounded-full",
    text: "rounded h-3 w-full"
  };

  return (
    <div className={`${baseClass} ${variantClasses[variant]} ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer" />
    </div>
  );
};

export const StatSkeleton = () => (
  <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-slate-200/60 shadow-sm flex flex-col gap-3 h-full">
    <Skeleton className="w-10 h-10 rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-2 w-1/3" />
    </div>
  </div>
);

export const HeaderSkeleton = ({ children }) => (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/60 shadow-sm flex flex-col gap-6">
        <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-2 w-64" />
            </div>
        </div>
        {children}
    </div>
);

export const ChartSkeleton = () => (
  <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/60 shadow-sm h-[300px] flex flex-col gap-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-8 w-24 rounded-lg" />
    </div>
    <Skeleton className="flex-1 w-full rounded-xl" />
  </div>
);

export const AnalyticsSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
    <ChartSkeleton />
    <ChartSkeleton />
  </div>
);

export const PulseSkeleton = () => (
  <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden h-full">
    <div className="px-5 py-4 border-b border-slate-100">
      <Skeleton className="h-4 w-32" />
    </div>
    <div className="p-5 space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-2 w-32" />
            </div>
          </div>
          <Skeleton className="w-12 h-4 rounded-lg" />
        </div>
      ))}
    </div>
  </div>
);

export const TableRowSkeleton = ({ cols = 5 }) => (
  <tr className="animate-pulse">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-4">
        <Skeleton className="h-4 w-full rounded" />
      </td>
    ))}
  </tr>
);
