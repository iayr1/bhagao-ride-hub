import { Car, Clock, DollarSign, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface RideCardProps {
  vehicleType: string;
  duration: string;
  price: string;
  rating: number;
  capacity: string;
  isSelected?: boolean;
  onSelect: () => void;
}

const RideCard = ({
  vehicleType,
  duration,
  price,
  rating,
  capacity,
  isSelected = false,
  onSelect
}: RideCardProps) => {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'ring-2 ring-primary shadow-primary bg-primary/5' 
          : 'hover:shadow-card hover:border-primary/50'
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Car className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{vehicleType}</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{duration}</span>
                <span>•</span>
                <span>{capacity}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="font-bold text-lg text-foreground">{price}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 text-warning fill-current" />
              <span className="text-sm text-muted-foreground">{rating}</span>
            </div>
          </div>
        </div>
        
        {isSelected && (
          <div className="mt-3 pt-3 border-t border-border">
            <Button variant="hero" className="w-full">
              Book {vehicleType}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RideCard;