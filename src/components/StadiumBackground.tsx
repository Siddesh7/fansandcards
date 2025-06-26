
import { cn } from '@/lib/utils';

interface StadiumBackgroundProps {
  className?: string;
  showFlares?: boolean;
  showLights?: boolean;
}

const StadiumBackground = ({ className, showFlares = true, showLights = true }: StadiumBackgroundProps) => {
  return (
    <div className={cn('absolute inset-0', className)}>
      {/* Stadium Crowd Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1472396961693-142e6e269027')] bg-cover bg-center opacity-15"></div>
      
      {/* Flares */}
      {showFlares && (
        <>
          <div className="absolute top-10 left-10 w-4 h-4 bg-red-500 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-20 right-20 w-3 h-3 bg-yellow-400 rounded-full animate-pulse opacity-70" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-32 left-1/4 w-5 h-5 bg-red-600 rounded-full animate-pulse opacity-50" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 right-1/3 w-4 h-4 bg-orange-500 rounded-full animate-pulse opacity-60" style={{ animationDelay: '0.5s' }}></div>
        </>
      )}
      
      {/* Stadium Lights */}
      {showLights && (
        <>
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-20 right-1/4 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </>
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white opacity-5"></div>
    </div>
  );
};

export default StadiumBackground;
