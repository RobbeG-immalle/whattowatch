export default function MovieCardSkeleton() {
  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
      <div className="aspect-[2/3] skeleton" />
      <div className="p-4 space-y-2">
        <div className="h-4 skeleton w-3/4" />
        <div className="h-3 skeleton w-1/4" />
        <div className="flex gap-1">
          <div className="h-5 skeleton w-16 rounded-full" />
          <div className="h-5 skeleton w-16 rounded-full" />
        </div>
        <div className="space-y-1">
          <div className="h-3 skeleton w-full" />
          <div className="h-3 skeleton w-full" />
          <div className="h-3 skeleton w-2/3" />
        </div>
      </div>
    </div>
  );
}
