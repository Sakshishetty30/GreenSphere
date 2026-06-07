"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { 
  MapPin, Sun, CloudRain, Thermometer, Droplets, Leaf, 
  AlertCircle, CheckCircle2, ChevronRight, Activity, Sprout, Wind,
  Bell
} from "lucide-react";
import Link from "next/link";

export default function PlantCarePage() {
  const { garden, waterPlant } = useApp();
  const [location, setLocation] = useState("New York, NY");
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [tempLocation, setTempLocation] = useState(location);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(tempLocation.trim()) {
      setLocation(tempLocation);
      setIsEditingLocation(false);
    }
  };

  // Mock environmental calculations based on string matching for demo
  const isWarm = location.toLowerCase().match(/(california|florida|texas|india|brazil|spain|arizona)/);
  const isHumid = location.toLowerCase().match(/(florida|india|brazil|uk|london|seattle|miami)/);
  
  const envData = {
    temp: isWarm ? 28 : 18,
    humidity: isHumid ? 75 : 42,
    rainfall: isHumid ? "High chance of rain" : "No rain expected",
    sunlight: isWarm ? "Strong Direct UV" : "Moderate UV Index"
  };

  const getPlantStatus = (plant: any) => {
    if (!currentTime) return "healthy";
    const lastW = new Date(plant.lastWatered).getTime();
    const now = currentTime.getTime();
    const hoursSince = (now - lastW) / (1000 * 60 * 60);
    const interval = plant.waterIntervalHours;
    
    if (hoursSince >= interval) return "needs-water";
    if (hoursSince >= interval * 0.8) return "warning";
    return "healthy";
  };

  const tasks = garden.map(plant => {
    const status = getPlantStatus(plant);
    return {
      plantId: plant.id,
      plantName: plant.name,
      type: status === "needs-water" ? "critical" : status === "warning" ? "warning" : "info",
      action: status === "needs-water" ? "Water Immediately" : status === "warning" ? "Check Soil Moisture" : "Routine Observation",
      due: status === "needs-water" ? "Overdue" : status === "warning" ? "Soon" : "Next few days"
    };
  }).sort((a, b) => (a.type === "critical" ? -1 : 1));

  // Render safety for hydration mismatch
  if (!currentTime) return <div className="min-h-screen bg-bg-deep" />;

  return (
    <main className="min-h-screen pt-24 pb-16 bg-bg-deep text-txt-white font-sans relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent-lime/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent-neon/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 space-y-8">
        
        {/* Header & Location */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-border-subtle pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Plant Care Center</h1>
            <p className="text-txt-gray max-w-2xl">Intelligent monitoring, automated alerts, and hyper-local gardening insights to keep your indoor jungle thriving.</p>
          </div>
          
          <div className="glass-card p-4 flex items-center gap-4 min-w-[280px]">
            <div className="w-10 h-10 rounded-full bg-accent-green/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-accent-green" />
            </div>
            {isEditingLocation ? (
              <form onSubmit={handleLocationSubmit} className="flex-grow flex gap-2">
                <input 
                  type="text" 
                  value={tempLocation} 
                  onChange={e => setTempLocation(e.target.value)}
                  className="w-full bg-bg-sec-light border border-border-subtle rounded-md px-2 py-1 text-sm text-txt-white focus:outline-none focus:border-accent-neon"
                  autoFocus
                />
                <button type="submit" className="text-xs bg-accent-green text-white px-3 py-1 rounded-md font-bold">Set</button>
              </form>
            ) : (
              <div className="flex-grow flex justify-between items-center cursor-pointer group" onClick={() => setIsEditingLocation(true)}>
                <div>
                  <p className="text-[10px] text-txt-gray uppercase tracking-widest font-bold">Local Station</p>
                  <p className="font-semibold">{location}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-txt-gray group-hover:text-accent-neon transition-colors" />
              </div>
            )}
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Environment & Tips */}
          <div className="space-y-8">
            {/* Environment Module */}
            <div className="glass-card p-6 border-t-4 border-t-accent-neon">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-accent-neon" /> Live Environment
                </h2>
                <span className="flex items-center gap-1.5 text-xs text-accent-neon bg-accent-neon/10 px-2 py-1 rounded-full border border-accent-neon/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-neon animate-pulse" /> Live
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-bg-sec-light border border-border-subtle space-y-1">
                  <Thermometer className="w-6 h-6 text-orange-400 mb-2" />
                  <p className="text-2xl font-bold">{envData.temp}°C</p>
                  <p className="text-xs text-txt-gray font-medium">Temperature</p>
                </div>
                <div className="p-4 rounded-2xl bg-bg-sec-light border border-border-subtle space-y-1">
                  <Wind className="w-6 h-6 text-blue-400 mb-2" />
                  <p className="text-2xl font-bold">{envData.humidity}%</p>
                  <p className="text-xs text-txt-gray font-medium">Humidity</p>
                </div>
                <div className="p-4 rounded-2xl bg-bg-sec-light border border-border-subtle space-y-1">
                  <Sun className="w-6 h-6 text-yellow-500 mb-2" />
                  <p className="text-sm font-bold truncate" title={envData.sunlight}>{envData.sunlight}</p>
                  <p className="text-xs text-txt-gray font-medium">Sunlight</p>
                </div>
                <div className="p-4 rounded-2xl bg-bg-sec-light border border-border-subtle space-y-1">
                  <CloudRain className="w-6 h-6 text-blue-300 mb-2" />
                  <p className="text-sm font-bold truncate" title={envData.rainfall}>{envData.rainfall}</p>
                  <p className="text-xs text-txt-gray font-medium">Precipitation</p>
                </div>
              </div>
            </div>

            {/* Smart Tips Module */}
            <div className="glass-card p-6 bg-gradient-to-br from-bg-sec-light to-white">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Sprout className="w-5 h-5 text-accent-green" /> Seasonal Insights
              </h2>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start border-b border-border-subtle pb-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Droplets className="w-3 h-3 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Adjust Watering Frequency</h4>
                    <p className="text-xs text-txt-gray mt-1 leading-relaxed">
                      With {envData.temp > 25 ? "higher temperatures" : "current temperatures"}, consider checking soil moisture {envData.temp > 25 ? "more frequently" : "on your normal schedule"}.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="mt-1 w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                    <Sun className="w-3 h-3 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Sunlight Repositioning</h4>
                    <p className="text-xs text-txt-gray mt-1 leading-relaxed">
                      Ensure your indirect-light plants aren't receiving harsh midday rays during the summer peak.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Plant Tracking & Tasks */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Task Center */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Bell className="w-5 h-5 text-accent-neon" /> Maintenance Schedule
                </h2>
                <span className="text-xs font-bold bg-bg-deep px-3 py-1 rounded-full border border-border-subtle">
                  {tasks.filter(t => t.type === 'critical').length} Urgent
                </span>
              </div>
              
              <div className="space-y-3">
                {tasks.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-border-subtle rounded-2xl">
                    <CheckCircle2 className="w-10 h-10 text-accent-lime mx-auto mb-3 opacity-50" />
                    <p className="text-txt-gray">No pending tasks. Add plants to your garden to see schedules here.</p>
                    <Link href="/products" className="inline-block mt-4 text-sm text-accent-green font-bold hover:underline">Shop Plants &rarr;</Link>
                  </div>
                ) : (
                  tasks.slice(0, 4).map((task, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border ${
                      task.type === 'critical' ? 'border-red-200 bg-red-50' : 
                      task.type === 'warning' ? 'border-yellow-200 bg-yellow-50' : 
                      'border-border-subtle bg-bg-sec-light'
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${
                          task.type === 'critical' ? 'bg-red-500 animate-pulse' : 
                          task.type === 'warning' ? 'bg-yellow-500' : 'bg-accent-lime'
                        }`} />
                        <div>
                          <p className={`text-sm font-bold ${
                            task.type === 'critical' ? 'text-red-900' : 
                            task.type === 'warning' ? 'text-yellow-900' : 'text-txt-white'
                          }`}>{task.action}</p>
                          <p className="text-xs text-txt-gray mt-0.5">{task.plantName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-xs font-bold ${
                          task.type === 'critical' ? 'text-red-600' : 
                          task.type === 'warning' ? 'text-yellow-600' : 'text-txt-muted'
                        }`}>{task.due}</span>
                        {task.action.includes("Water") && (
                          <button 
                            onClick={() => waterPlant(task.plantId)}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors shadow-md cursor-pointer"
                            title="Mark as watered"
                          >
                            <Droplets className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* My Garden Tracking List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Garden Tracking</h2>
                <Link href="/dashboard" className="text-sm font-bold text-accent-green hover:underline">View Full Garden &rarr;</Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {garden.length === 0 ? (
                  <div className="md:col-span-2 glass-card p-8 text-center text-txt-gray">
                    Your digital garden is currently empty. 
                  </div>
                ) : (
                  garden.map(plant => {
                    const healthColor = plant.health > 80 ? 'bg-accent-neon' : plant.health > 40 ? 'bg-yellow-400' : 'bg-red-500';
                    return (
                      <div key={plant.id} className="glass-card p-4 flex gap-4 hover:border-accent-neon/30 transition-all">
                        <div className="w-20 h-20 rounded-xl bg-bg-medium overflow-hidden shrink-0 border border-border-subtle">
                          <img src={plant.imageUrl} alt={plant.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-sm truncate">{plant.name}</h3>
                            <p className="text-[10px] text-txt-gray italic truncate">{plant.species}</p>
                          </div>
                          
                          <div className="space-y-2 mt-2">
                            <div className="flex justify-between items-center text-[10px] font-bold text-txt-gray uppercase">
                              <span>Health Status</span>
                              <span className={plant.health > 80 ? 'text-accent-green' : plant.health > 40 ? 'text-yellow-600' : 'text-red-600'}>
                                {plant.health}%
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-bg-deep rounded-full overflow-hidden">
                              <div className={`h-full ${healthColor} rounded-full transition-all duration-1000`} style={{ width: `${plant.health}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
