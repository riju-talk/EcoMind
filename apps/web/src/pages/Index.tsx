
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MessageSquare, Plus, Sun, Clock, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PlantCard from '@/components/PlantCard';
import CareCalendar from '@/components/CareCalendar';
import AIAssistant from '@/components/AIAssistant';
import AddPlantDialog from '@/components/AddPlantDialog';

const Index = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [showAddPlant, setShowAddPlant] = useState(false);

  // Fetch user's plants
  const { data: plants = [], refetch: refetchPlants } = useQuery({
    queryKey: ['plants', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plants')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch today's tasks
  const { data: todaysTasks = [] } = useQuery({
    queryKey: ['todaysTasks', user?.id],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('care_tasks')
        .select(`
          *,
          plants (name)
        `)
        .eq('scheduled_date', today)
        .eq('status', 'pending');
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You've been signed out successfully.",
    });
  };

  const handleAddPlant = async (plantData: any) => {
    const { error } = await supabase
      .from('plants')
      .insert([{
        ...plantData,
        user_id: user?.id
      }]);

    if (error) {
      toast({
        title: "Error adding plant",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Plant added!",
      description: "Your new plant has been added successfully.",
    });
    
    refetchPlants();
    setShowAddPlant(false);
  };

  // Calculate stats
  const healthyPlants = plants.filter(p => p.health_status === 'Healthy').length;
  const plantsNeedingAttention = plants.filter(p => p.health_status === 'Needs Attention').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌱</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">HaritPal</h1>
                <p className="text-sm text-gray-600">Your Smart Plant Care Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
              <Button onClick={() => setShowAddPlant(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Plant
              </Button>
              <Button variant="outline" onClick={handleSignOut} size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Your Garden Dashboard
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your plants, get personalized care reminders, and let our AI assistant help you grow a thriving garden
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/60 backdrop-blur-sm border-green-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{plants.length}</div>
              <div className="text-sm text-gray-600">Total Plants</div>
            </CardContent>
          </Card>
          <Card className="bg-white/60 backdrop-blur-sm border-blue-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{todaysTasks.length}</div>
              <div className="text-sm text-gray-600">Tasks Today</div>
            </CardContent>
          </Card>
          <Card className="bg-white/60 backdrop-blur-sm border-yellow-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{plantsNeedingAttention}</div>
              <div className="text-sm text-gray-600">Needs Attention</div>
            </CardContent>
          </Card>
          <Card className="bg-white/60 backdrop-blur-sm border-green-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{healthyPlants}</div>
              <div className="text-sm text-gray-600">Healthy Plants</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Sun className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Care Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="assistant" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>AI Assistant</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            {/* Today's Tasks */}
            <Card className="bg-white/60 backdrop-blur-sm border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span>Today's Tasks</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todaysTasks.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No tasks scheduled for today!</p>
                ) : (
                  <div className="space-y-3">
                    {todaysTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            task.task_type === 'watering' ? 'bg-blue-500' : 
                            task.task_type === 'fertilizing' ? 'bg-green-500' : 'bg-yellow-500'
                          }`}></div>
                          <span className="font-medium">{task.title}</span>
                        </div>
                        <Badge variant="outline">{task.task_type}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Plants Grid */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Plants</h3>
              {plants.length === 0 ? (
                <Card className="bg-white/60 backdrop-blur-sm border-green-200">
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No plants yet</h3>
                    <p className="text-gray-600 mb-4">Start your plant care journey by adding your first plant!</p>
                    <Button onClick={() => setShowAddPlant(true)} className="bg-green-600 hover:bg-green-700">
                      Add Your First Plant
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {plants.map((plant) => (
                    <PlantCard key={plant.id} plant={plant} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <CareCalendar tasks={todaysTasks} />
          </TabsContent>

          <TabsContent value="assistant">
            <AIAssistant />
          </TabsContent>
        </Tabs>
      </div>

      <AddPlantDialog 
        open={showAddPlant} 
        onOpenChange={setShowAddPlant} 
        onAddPlant={handleAddPlant} 
      />
    </div>
  );
};

export default Index;
