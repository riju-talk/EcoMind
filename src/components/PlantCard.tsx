
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sun, MapPin, Clock } from 'lucide-react';

interface Plant {
  id: number;
  name: string;
  type: string;
  location: string;
  sunlight: string;
  lastWatered: string;
  nextWatering: string;
  health: string;
  image: string;
}

interface PlantCardProps {
  plant: Plant;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant }) => {
  const getHealthColor = (health: string) => {
    switch (health) {
      case 'Healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Needs Attention':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
      <div className="relative">
        <img 
          src={plant.image} 
          alt={plant.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <Badge className={`absolute top-3 right-3 ${getHealthColor(plant.health)}`}>
          {plant.health}
        </Badge>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800">{plant.name}</CardTitle>
        <Badge variant="outline" className="w-fit">{plant.type}</Badge>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{plant.location}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Sun className="w-4 h-4" />
          <span>{plant.sunlight}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Last watered: {plant.lastWatered}</span>
        </div>
        
        <div className="pt-2 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Next watering: {plant.nextWatering}
          </p>
          <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
            Water Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlantCard;
