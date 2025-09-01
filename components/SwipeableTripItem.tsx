import { useState, useRef, useEffect } from "react";
import { CustomCard } from "./CustomCard";
import { CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, MapPin, Trash2, Edit3 } from "lucide-react";

interface Trip {
  id: string;
  country: string;
  countryCode: string;
  flag: string;
  entryDate: string;
  exitDate: string;
  duration: number;
  status?: "completed" | "ongoing" | "planned";
  notes?: string;
}

interface SwipeableTripItemProps {
  trip: Trip;
  onEdit?: (trip: Trip) => void;
  onDelete?: (trip: Trip) => void;
}

export function SwipeableTripItem({ trip, onEdit, onDelete }: SwipeableTripItemProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);

  const statusColors = {
    completed: "bg-[var(--green)]/10 text-[var(--green)] border-[var(--green)]/20",
    ongoing: "bg-[var(--brand)]/10 text-[var(--brand)] border-[var(--brand)]/20", 
    planned: "bg-[var(--yellow)]/10 text-[var(--yellow)] border-[var(--yellow)]/20"
  };

  const statusLabels = {
    completed: "Завершена",
    ongoing: "В процессе",
    planned: "Запланирована"
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startXRef.current = touch.clientX;
    currentXRef.current = translateX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - startXRef.current;
    const newTranslateX = currentXRef.current + deltaX;
    
    // Limit the swipe range
    const maxSwipe = 120;
    const minSwipe = -120;
    const clampedTranslateX = Math.max(minSwipe, Math.min(maxSwipe, newTranslateX));
    
    setTranslateX(clampedTranslateX);
    setShowActions(Math.abs(clampedTranslateX) > 30);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    const threshold = 80;
    
    if (translateX > threshold) {
      // Swipe right - edit
      setTranslateX(0);
      setShowActions(false);
      onEdit?.(trip);
    } else if (translateX < -threshold) {
      // Swipe left - delete
      setTranslateX(0);
      setShowActions(false);
      onDelete?.(trip);
    } else {
      // Return to original position
      setTranslateX(0);
      setShowActions(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startXRef.current = e.clientX;
    currentXRef.current = translateX;
    setIsDragging(true);
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startXRef.current;
    const newTranslateX = currentXRef.current + deltaX;
    
    const maxSwipe = 120;
    const minSwipe = -120;
    const clampedTranslateX = Math.max(minSwipe, Math.min(maxSwipe, newTranslateX));
    
    setTranslateX(clampedTranslateX);
    setShowActions(Math.abs(clampedTranslateX) > 30);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    const threshold = 80;
    
    if (translateX > threshold) {
      setTranslateX(0);
      setShowActions(false);
      onEdit?.(trip);
    } else if (translateX < -threshold) {
      setTranslateX(0);
      setShowActions(false);
      onDelete?.(trip);
    } else {
      setTranslateX(0);
      setShowActions(false);
    }
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Action Buttons Background */}
      <div className="absolute inset-0 flex">
        {/* Edit action (right side) */}
        <div 
          className={`w-24 flex items-center justify-center bg-[var(--brand)]/20 transition-opacity duration-200 ${
            translateX > 30 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Edit3 size={20} className="text-[var(--brand)]" />
        </div>
        
        {/* Spacer */}
        <div className="flex-1" />
        
        {/* Delete action (left side) */}
        <div 
          className={`w-24 flex items-center justify-center bg-[var(--red)]/20 transition-opacity duration-200 ${
            translateX < -30 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Trash2 size={20} className="text-[var(--red)]" />
        </div>
      </div>

      {/* Trip Item */}
      <div
        ref={itemRef}
        className="relative z-10 transition-transform duration-200 ease-out"
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        <CustomCard className="cursor-grab active:cursor-grabbing select-none">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{trip.flag}</span>
                <div>
                  <h3 className="font-semibold text-[var(--text)]">
                    {trip.countryCode} • {trip.country}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)] mt-1">
                    <Calendar size={14} />
                    <span>{trip.entryDate} — {trip.exitDate}</span>
                  </div>
                </div>
              </div>
              
              {trip.status && (
                <Badge className={statusColors[trip.status]}>
                  {statusLabels[trip.status]}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                <MapPin size={14} />
                <span>{trip.duration} {trip.duration === 1 ? 'день' : trip.duration < 5 ? 'дня' : 'дней'}</span>
              </div>
              
              {trip.notes && (
                <span className="text-xs text-[var(--text-secondary)] italic">
                  {trip.notes.length > 30 ? `${trip.notes.substring(0, 30)}...` : trip.notes}
                </span>
              )}
            </div>
          </CardContent>
        </CustomCard>
      </div>

      {/* Hint text */}
      {showActions && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-[var(--surface)]/90 backdrop-blur-sm rounded-full px-3 py-1">
            <p className="text-xs text-[var(--text-secondary)]">
              {translateX > 0 ? '👉 Редактировать' : '👈 Удалить'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}