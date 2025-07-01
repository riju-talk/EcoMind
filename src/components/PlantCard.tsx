
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sun, MapPin, Clock, Droplets } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface Plant {
  id: string;
  name: string;
  type: string;
  location: string;
  sunlight_requirement: string;
  last_watered_date: string | null;
  health_status: string;
  image_url: string | null;
  watering_frequency_days: number;
}

interface PlantCardProps {
  plant: Plant;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const getNextWateringDate = () => {
    if (!plant.last_watered_date) return 'Today';
    
    const lastWatered = new Date(plant.last_watered_date);
    const nextWatering = new Date(lastWatered);
    nextWatering.setDate(lastWatered.getDate() + plant.watering_frequency_days);
    
    const today = new Date();
    const diffTime = nextWatering.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `In ${diffDays} days`;
  };

  const handleWaterNow = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Update the plant's last watered date
    const { error: updateError } = await supabase
      .from('plants')
      .update({ last_watered_date: today })
      .eq('id', plant.id);

    if (updateError) {
      toast({
        title: "Error",
        description: "Failed to update watering record",
        variant: "destructive",
      });
      return;
    }

    // Log the care activity
    const { error: logError } = await supabase
      .from('plant_care_logs')
      .insert([{
        plant_id: plant.id,
        task_type: 'watering',
        notes: 'Manual watering via Water Now button'
      }]);

    if (logError) {
      console.error('Failed to log care activity:', logError);
    }

    // Update any pending watering tasks for today
    const { error: taskError } = await supabase
      .from('care_tasks')
      .update({ 
        status: 'completed',
        completed_date: new Date().toISOString()
      })
      .eq('plant_id', plant.id)
      .eq('task_type', 'watering')
      .eq('scheduled_date', today)
      .eq('status', 'pending');

    if (taskError) {
      console.error('Failed to update task status:', taskError);
    }

    toast({
      title: "Plant watered! 💧",
      description: `${plant.name} has been watered successfully.`,
    });

    // Refresh the data
    queryClient.invalidateQueries({ queryKey: ['plants'] });
    queryClient.invalidateQueries({ queryKey: ['todaysTasks'] });
  };

  const getLastWateredText = () => {
    if (!plant.last_watered_date) return 'Never watered';
    
    const lastWatered = new Date(plant.last_watered_date);
    const today = new Date();
    const diffTime = today.getTime() - lastWatered.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
      <div className="relative">
        <img 
          src={plant.image_url || "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=300&h=200&fit=crop"} 
          alt={plant.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <Badge className={`absolute top-3 right-3 ${getHealthColor(plant.health_status)}`}>
          {plant.health_status}
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
          <span>{plant.sunlight_requirement}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Last watered: {getLastWateredText()}</span>
        </div>
        
        <div className="pt-2 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Next watering: {getNextWateringDate()}
          </p>
          <Button 
            size="sm" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={handleWaterNow}
          >
            <Droplets className="w-4 h-4 mr-2" />
            Water Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlantCard;
