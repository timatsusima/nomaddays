import { CustomCard } from "./CustomCard";
import { CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, MapPin } from "lucide-react";

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

interface TripListItemProps {
  trip: Trip;
  onClick?: (trip: Trip) => void;
}

export function TripListItem({ trip, onClick }: TripListItemProps) {
  const statusColors = {
    completed: "bg-green/10 text-green border-green/20",
    ongoing: "bg-brand/10 text-brand border-brand/20", 
    planned: "bg-yellow/10 text-yellow border-yellow/20"
  };

  const statusLabels = {
    completed: "Завершена",
    ongoing: "В процессе",
    planned: "Запланирована"
  };

  return (
    <CustomCard 
      interactive 
      onClick={() => onClick?.(trip)}
      className="hover:shadow-sm transition-shadow"
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{trip.flag}</span>
            <div>
              <h3 className="font-semibold text-foreground">
                {trip.countryCode} • {trip.country}
              </h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
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
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin size={14} />
            <span>{trip.duration} {trip.duration === 1 ? 'день' : trip.duration < 5 ? 'дня' : 'дней'}</span>
          </div>
          
          {trip.notes && (
            <span className="text-xs text-muted-foreground italic">
              {trip.notes.length > 30 ? `${trip.notes.substring(0, 30)}...` : trip.notes}
            </span>
          )}
        </div>
      </CardContent>
    </CustomCard>
  );
}