import { motion } from 'framer-motion';

export const MembraneSkeleton = () => (
  <div className="rounded-3xl glass p-6 animate-pulse">
    <div className="h-56 bg-white/5 rounded-2xl" />
  </div>
);

export const MetricSkeleton = () => (
  <div className="rounded-3xl glass p-5 space-y-4 animate-pulse">
    <div className="h-4 w-24 bg-white/5 rounded-full" />
    <div className="h-12 w-32 bg-white/5 rounded-2xl" />
    <div className="h-20 w-full bg-white/5 rounded-xl" />
  </div>
);