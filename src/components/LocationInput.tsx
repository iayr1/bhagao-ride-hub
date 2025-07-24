import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LocationInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onUseCurrentLocation?: () => void;
  className?: string;
}

const LocationInput = ({ 
  placeholder, 
  value, 
  onChange, 
  onUseCurrentLocation,
  className = "" 
}: LocationInputProps) => {
  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 pr-12 h-12 bg-white shadow-card border-border focus:ring-2 focus:ring-primary"
        />
        {onUseCurrentLocation && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onUseCurrentLocation}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 hover:bg-primary/10"
          >
            <MapPin className="h-4 w-4 text-primary" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default LocationInput;