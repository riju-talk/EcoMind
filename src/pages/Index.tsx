
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MessageSquare, Plus, Sun, Clock, Camera } from 'lucide-react';
import PlantCard from '@/components/PlantCard';
import CareCalendar from '@/components/CareCalendar';
import AIAssistant from '@/components/AIAssistant';
import AddPlantDialog from '@/components/AddPlantDialog';

const Index = () => {
  const [plants, setPlants] = useState([
    {
      id: 1,
      name: "Monstera Deliciosa",
      type: "Indoor",
      location: "Living Room",
      sunlight: "Bright, indirect",
      lastWatered: "2 days ago",
      nextWatering: "Tomorrow",
      health: "Healthy",
      image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      name: "Snake Plant",
      type: "Indoor",
      location: "Bedroom",
      sunlight: "Low light",
      lastWatered: "1 week ago",
      nextWatering: "In 3 days",
      health: "Needs Attention",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop"
    }
  ]);

  const [showAddPlant, setShowAddPlant] = useState(false);

  const todaysTasks = [
    { task: "Water Monstera Deliciosa", type: "watering", time: "Morning" },
    { task: "Check Snake Plant soil", type: "checking", time: "Evening" },
    { task: "Apply neem oil to Tulsi", type: "treatment", time: "Afternoon" }
  ];

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
            <Button onClick={() => setShowAddPlant(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Plant
            </Button>
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
              <div className="text-3xl font-bold text-yellow-600 mb-2">1</div>
              <div className="text-sm text-gray-600">Needs Attention</div>
            </CardContent>
          </Card>
          <Card className="bg-white/60 backdrop-blur-sm border-purple-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">7</div>
              <div className="text-sm text-gray-600">Day Streak</div>
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
                <div className="space-y-3">
                  {todaysTasks.map((task, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          task.type === 'watering' ? 'bg-blue-500' : 
                          task.type === 'treatment' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}></div>
                        <span className="font-medium">{task.task}</span>
                      </div>
                      <Badge variant="outline">{task.time}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Plants Grid */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Plants</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plants.map((plant) => (
                  <PlantCard key={plant.id} plant={plant} />
                ))}
              </div>
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

      <AddPlantDialog open={showAddPlant} onOpenChange={setShowAddPlant} onAddPlant={(plant) => {
        setPlants([...plants, { ...plant, id: plants.length + 1 }]);
        setShowAddPlant(false);
      }} />
    </div>
  );
};

export default Index;
