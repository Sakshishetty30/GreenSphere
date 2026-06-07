"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Droplets, Camera, Clock, Activity, AlertCircle, ChevronDown, ChevronUp, Leaf, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function MyGardenPage() {
  const { garden, waterPlant, addPlantPhoto, logCareActivity } = useApp();
  const [expandedPlantId, setExpandedPlantId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getAgeInDays = (isoDate?: string) => {
    if (!currentTime || !isoDate) return 0;
    const diff = currentTime.getTime() - new Date(isoDate).getTime();
    return Math.max(0, Math.floor(diff / (1000 * 3600 * 24)));
  };

  const getNextMilestone = (stage?: string) => {
    if (stage === "Seedling") return "Vegetative (in ~14 days)";
    if (stage === "Vegetative") return "Flowering (in ~30 days)";
    if (stage === "Flowering") return "Mature";
    return "Fully Grown";
  };

  const handleUploadPhoto = (plantId: string) => {
    // Mock upload: add a generic plant growth photo to simulate user uploading
    const mockPhotos = [
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1416879598555-2a0614051065?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&q=80&w=400"
    ];
    const newPhoto = mockPhotos[Math.floor(Math.random() * mockPhotos.length)];
    addPlantPhoto(plantId, newPhoto);
    logCareActivity(plantId, "Photo Uploaded", "Tracked new growth progress with a photo.");
  };

  const handleAction = (plantId: string, action: string) => {
    if (action === "Watered") {
      waterPlant(plantId);
    }
    logCareActivity(plantId, action, `Performed scheduled ${action.toLowerCase()}.`);
  };

  if (!currentTime) return <div className="min-h-screen bg-bg-deep" />;

  return (
    <div className="pb-16 text-txt-white font-sans relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-lime/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 space-y-6 mt-0">
        
        <header className="mb-12 border-b border-border-subtle pb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">My Garden</h1>
          <p className="text-txt-gray max-w-2xl">Track the growth, milestones, and care history of every plant in your personal collection.</p>
        </header>

        {garden.length === 0 ? (
          <div className="text-center py-20 glass-card">
            <Leaf className="w-16 h-16 text-accent-lime mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-txt-white mb-2">Your Garden is Empty</h2>
            <p className="text-txt-gray mb-6">Plants you purchase will automatically appear here for tracking and visual history.</p>
            <Link href="/products" className="px-8 py-3 rounded-full bg-accent-green text-white font-bold hover:bg-accent-lime transition-all">
              Shop Plants
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {garden.map(plant => (
              <div key={plant.id} className="glass-card overflow-hidden transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-border-subtle">
                <div 
                  className="p-6 flex flex-col md:flex-row items-center gap-6 cursor-pointer bg-bg-sec-dark hover:bg-bg-sec-light transition-colors"
                  onClick={() => setExpandedPlantId(expandedPlantId === plant.id ? null : plant.id)}
                >
                  <div className="w-24 h-24 rounded-2xl bg-bg-medium overflow-hidden shrink-0 border border-border-subtle shadow-md relative group">
                    <img src={plant.photos?.[plant.photos.length - 1] || plant.imageUrl} alt={plant.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleUploadPhoto(plant.id); }}
                      className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Camera className="w-6 h-6 text-white mb-1" />
                      <span className="text-[9px] font-bold text-white uppercase tracking-wider">Update Photo</span>
                    </button>
                  </div>

                  <div className="flex-grow flex flex-col justify-center w-full">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-xl font-bold font-sans text-txt-white">{plant.name}</h3>
                        <p className="text-xs text-txt-gray italic font-serif">{plant.species}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-accent-green bg-accent-green/10 px-3 py-1.5 rounded-full border border-accent-green/20 uppercase tracking-widest shadow-sm">
                          {plant.growthStage || "Seedling"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 text-xs font-medium text-txt-white">
                      <div className="bg-bg-deep p-2.5 rounded-xl border border-border-subtle flex flex-col gap-1 shadow-sm">
                        <span className="text-[10px] text-txt-gray uppercase tracking-wider font-bold">Age</span>
                        <span className="flex items-center gap-1.5 font-bold"><Clock className="w-3.5 h-3.5 text-blue-500" /> {getAgeInDays(plant.plantingDate || plant.lastWatered)} Days</span>
                      </div>
                      <div className="bg-bg-deep p-2.5 rounded-xl border border-border-subtle flex flex-col gap-1 shadow-sm">
                        <span className="text-[10px] text-txt-gray uppercase tracking-wider font-bold">Health Index</span>
                        <span className="flex items-center gap-1.5 font-bold"><Activity className="w-3.5 h-3.5 text-green-500" /> {plant.health}%</span>
                      </div>
                      <div className="col-span-2 bg-bg-deep p-2.5 rounded-xl border border-border-subtle flex flex-col gap-1 shadow-sm">
                        <span className="text-[10px] text-txt-gray uppercase tracking-wider font-bold">Next Milestone</span>
                        <span className="text-txt-white font-bold">{getNextMilestone(plant.growthStage || "Seedling")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:block">
                    {expandedPlantId === plant.id ? <ChevronUp className="w-6 h-6 text-txt-gray" /> : <ChevronDown className="w-6 h-6 text-txt-gray" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedPlantId === plant.id && (
                  <div className="border-t border-border-subtle p-6 md:p-8 bg-bg-deep grid grid-cols-1 md:grid-cols-2 gap-10 shadow-inner">
                    
                    {/* Care Actions & Alerts */}
                    <div className="space-y-6">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-txt-gray border-b border-border-subtle pb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-accent-neon" /> Needs & Actions
                      </h4>
                      
                      <div className="flex flex-wrap gap-3">
                        <button onClick={() => handleAction(plant.id, "Watered")} className="flex-1 min-w-[100px] py-3 bg-blue-900/20 hover:bg-blue-900/40 text-blue-400 border border-blue-800/50 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                          <Droplets className="w-5 h-5" /> Water
                        </button>
                        <button onClick={() => handleAction(plant.id, "Fertilized")} className="flex-1 min-w-[100px] py-3 bg-yellow-900/20 hover:bg-yellow-900/40 text-yellow-400 border border-yellow-800/50 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                          <Leaf className="w-5 h-5" /> Fertilize
                        </button>
                        <button onClick={() => handleAction(plant.id, "Pruned")} className="flex-1 min-w-[100px] py-3 bg-purple-900/20 hover:bg-purple-900/40 text-purple-400 border border-purple-800/50 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                          <span className="text-lg leading-none">✂️</span> Prune
                        </button>
                      </div>

                      <div className="bg-bg-sec-dark border border-border-subtle p-5 rounded-2xl shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-accent-lime/10 blur-xl rounded-full" />
                        <div className="flex items-center gap-3 mb-2 relative z-10">
                          <CheckCircle2 className="w-5 h-5 text-accent-neon" />
                          <span className="text-sm font-bold text-txt-white">Automated Schedule</span>
                        </div>
                        <p className="text-xs text-txt-gray leading-relaxed relative z-10">
                          Based on its standard interval of <strong>{plant.waterIntervalHours} hours</strong> and its current growth stage ({plant.growthStage || "Seedling"}), 
                          you should next check moisture levels and prepare for watering in about <strong>{Math.max(1, Math.floor(plant.waterIntervalHours / 24))} days</strong>.
                        </p>
                      </div>
                    </div>

                    {/* History & Photos */}
                    <div className="space-y-6">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-txt-gray border-b border-border-subtle pb-2 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-accent-neon" /> Growth History
                      </h4>
                      
                      <div className="max-h-48 overflow-y-auto space-y-4 pr-2">
                        {(!plant.historyLogs || plant.historyLogs.length === 0) ? (
                          <p className="text-xs text-txt-muted italic bg-bg-sec-light p-4 rounded-xl border border-border-subtle">No activities logged yet.</p>
                        ) : (
                          plant.historyLogs.map(log => (
                            <div key={log.id} className="flex gap-4 text-sm border-l-2 border-accent-neon/50 pl-4 py-1 relative">
                              <div className="absolute w-2 h-2 rounded-full bg-accent-neon -left-[5px] top-2" />
                              <div className="min-w-[85px] pt-0.5">
                                <span className="text-[10px] text-txt-gray font-mono">{new Date(log.date).toLocaleDateString('en-GB')}</span>
                              </div>
                              <div className="bg-bg-sec-dark p-2.5 rounded-xl border border-border-subtle shadow-sm flex-grow">
                                <p className="font-bold text-txt-white text-xs">{log.action}</p>
                                {log.notes && <p className="text-[11px] text-txt-gray mt-1 leading-relaxed">{log.notes}</p>}
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {plant.photos && plant.photos.length > 0 && (
                        <div className="pt-4">
                          <p className="text-[10px] uppercase tracking-wider font-bold text-txt-gray mb-3">Photo Timeline</p>
                          <div className="flex gap-3 overflow-x-auto pb-4 snap-x">
                            {plant.photos.map((src, i) => (
                              <div key={i} className="relative group shrink-0 snap-center">
                                <img src={src} className="w-20 h-20 rounded-xl object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
