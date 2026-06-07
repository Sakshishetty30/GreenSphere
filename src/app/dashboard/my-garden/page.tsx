"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp, GardenPlant } from "@/context/AppContext";
import { Plus, Trash2, Droplet, Sparkles, Activity, ShieldAlert, X, FileImage, ChevronDown } from "lucide-react";

export default function MyGardenPage() {
  const { garden, waterPlant, addPlantToGarden, removePlantFromGarden } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isWaterDropdownOpen, setIsWaterDropdownOpen] = useState(false);

  const waterDropdownRef = useRef<HTMLDivElement>(null);

  // Add Plant Form State
  const [plantData, setPlantData] = useState({
    name: "",
    species: "",
    waterIntervalHours: 168, // Default 7 days
    sunlightRequired: "Medium Indirect Light",
    notes: "",
    imageUrl: "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=800"
  });

  const waterOptions = [
    { value: 72, label: "Every 3 Days" },
    { value: 168, label: "Every 7 Days" },
    { value: 336, label: "Every 14 Days" },
    { value: 720, label: "Every 30 Days" }
  ];

  // Click outside to close water dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (waterDropdownRef.current && !waterDropdownRef.current.contains(event.target as Node)) {
        setIsWaterDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddPlant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plantData.name || !plantData.species) return;

    addPlantToGarden({
      name: plantData.name,
      species: plantData.species,
      waterIntervalHours: Number(plantData.waterIntervalHours),
      sunlightRequired: plantData.sunlightRequired,
      notes: plantData.notes,
      imageUrl: plantData.imageUrl
    });

    // Reset Form
    setPlantData({
      name: "",
      species: "",
      waterIntervalHours: 168,
      sunlightRequired: "Medium Indirect Light",
      notes: "",
      imageUrl: "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=800"
    });
    setShowAddModal(false);
  };

  const presetImages = [
    { label: "Fern specimen", url: "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=800" },
    { label: "Monstera variant", url: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=800" },
    { label: "Succulent vector", url: "https://images.unsplash.com/photo-1453904300235-df521a8e430f?auto=format&fit=crop&q=80&w=800" },
    { label: "Tropical Orchid", url: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&q=80&w=800" }
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center pb-4 border-b border-border-subtle/50">
        <div>
          <h1 className="text-2xl font-extrabold text-txt-white tracking-tight">My Digital Garden</h1>
          <p className="text-xs text-txt-muted">Manage biological sensors, watering limits, and health index ratings.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 text-xs font-bold bg-accent-neon text-bg-deep rounded-xl hover:bg-accent-lime hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(163,255,18,0.2)]"
        >
          <Plus className="w-4 h-4" /> Add Plant Node
        </button>
      </div>

      {garden.length === 0 ? (
        <div className="text-center py-20 border border-border-subtle/50 rounded-2xl glass-card space-y-6">
          <span className="text-4xl">🌱</span>
          <h3 className="text-sm font-semibold text-txt-white">No active garden nodes</h3>
          <p className="text-xs text-txt-muted max-w-sm mx-auto">
            You have not linked any specimens to your digital garden ledger. Strains purchased at checkout automatically register here.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-accent-neon text-bg-deep rounded-xl text-xs font-bold shadow-[0_0_12px_rgba(163,255,18,0.2)]"
          >
            Register Custom Specimen
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {garden.map((plant) => (
            <div
              key={plant.id}
              className="rounded-2xl border border-border-subtle bg-bg-sec-dark/50 glass-card p-5 flex gap-5 relative overflow-hidden group"
            >
              {/* Image */}
              <img
                src={plant.imageUrl}
                alt={plant.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border border-border-subtle flex-shrink-0"
              />

              {/* Specs */}
              <div className="min-w-0 flex-grow flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm text-txt-white truncate pr-4">{plant.name}</h3>
                    <button
                      onClick={() => removePlantFromGarden(plant.id)}
                      className="p-1 rounded text-txt-muted hover:text-red-400 transition-colors"
                      title="De-register Specimen Node"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[10px] text-accent-neon font-mono truncate">{plant.species}</p>
                </div>

                {/* Health percentage bar */}
                <div className="space-y-1 font-mono text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-txt-muted">Health Telemetry</span>
                    <span className={`font-bold ${plant.health > 50 ? "text-accent-green" : "text-orange-400"}`}>
                      {plant.health}%
                    </span>
                  </div>
                  <div className="w-full h-1 bg-bg-deep rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        plant.health > 50 ? "bg-accent-green" : "bg-orange-400"
                      }`}
                      style={{ width: `${plant.health}%` }}
                    />
                  </div>
                </div>

                {/* Water action */}
                <div className="flex gap-2 items-center justify-between pt-1">
                  <span className="text-[9px] text-txt-muted font-mono flex items-center gap-1">
                    <Activity className="w-3 h-3 text-accent-neon" /> Water due: Weekly
                  </span>
                  <button
                    onClick={() => waterPlant(plant.id)}
                    className="px-3 py-1.5 text-[10px] font-bold rounded-lg bg-bg-sec-light border border-border-subtle hover:border-accent-neon hover:bg-accent-neon hover:text-bg-deep transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Droplet className="w-3 h-3 text-blue-400" /> Hydrate Node
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD PLANT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-bg-deep/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-card border border-border-subtle bg-bg-sec-dark p-6 rounded-2xl shadow-2xl space-y-6 text-left relative">
            
            <div className="flex justify-between items-center pb-3 border-b border-border-subtle">
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-txt-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-accent-neon" /> Register Custom Specimen
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded hover:bg-bg-sec-light text-txt-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPlant} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                  Specimen Display Name
                </label>
                <input
                  type="text"
                  required
                  value={plantData.name}
                  onChange={(e) => setPlantData({ ...plantData, name: e.target.value })}
                  placeholder="Living Room Fern V2"
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                  Species / Scientific Class
                </label>
                <input
                  type="text"
                  required
                  value={plantData.species}
                  onChange={(e) => setPlantData({ ...plantData, species: e.target.value })}
                  placeholder="Polypodiopsida Cy-4"
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 relative" ref={waterDropdownRef}>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                    Water Interval
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsWaterDropdownOpen(!isWaterDropdownOpen)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border-subtle bg-bg-deep text-txt-white focus:outline-none focus:border-accent-neon font-semibold flex items-center justify-between cursor-pointer transition-all duration-300"
                  >
                    <span>
                      {waterOptions.find(o => o.value === plantData.waterIntervalHours)?.label || "Every 7 Days"}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-accent-neon transition-transform duration-300 ${
                        isWaterDropdownOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  {isWaterDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1 z-30 rounded-xl border border-border-subtle bg-bg-deep/95 backdrop-blur-xl shadow-2xl overflow-hidden py-1">
                      {waterOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setPlantData({ ...plantData, waterIntervalHours: opt.value });
                            setIsWaterDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                            plantData.waterIntervalHours === opt.value
                              ? "bg-accent-neon/15 text-accent-neon"
                              : "text-txt-gray hover:bg-bg-sec-light hover:text-txt-white"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                    Sunlight Requirements
                  </label>
                  <input
                    type="text"
                    value={plantData.sunlightRequired}
                    onChange={(e) => setPlantData({ ...plantData, sunlightRequired: e.target.value })}
                    placeholder="Medium Indirect Light"
                    className="w-full px-3 py-2 text-xs rounded-xl glass-input"
                  />
                </div>
              </div>

              {/* Preset Visuals Select */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono flex items-center gap-1">
                  <FileImage className="w-3.5 h-3.5 text-accent-neon" /> Select Biological Vector
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {presetImages.map((img) => {
                    const isSelected = plantData.imageUrl === img.url;
                    return (
                      <button
                        key={img.label}
                        type="button"
                        onClick={() => setPlantData({ ...plantData, imageUrl: img.url })}
                        className={`aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                          isSelected ? "border-accent-neon scale-95" : "border-transparent opacity-60"
                        }`}
                        title={img.label}
                      >
                        <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-txt-muted font-mono">
                  Additional Notes
                </label>
                <input
                  type="text"
                  value={plantData.notes}
                  onChange={(e) => setPlantData({ ...plantData, notes: e.target.value })}
                  placeholder="Placed near South window pod."
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 text-xs font-bold rounded-xl bg-accent-neon text-bg-deep hover:bg-accent-lime transition-all flex items-center justify-center gap-1 shadow-[0_0_12px_rgba(163,255,18,0.2)]"
              >
                Sync Specimen Node
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
