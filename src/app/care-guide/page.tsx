"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp, Product, GardenPlant } from "@/context/AppContext";
import { 
  MapPin, Sun, CloudRain, Thermometer, Droplets, Leaf, 
  ChevronRight, Activity, Sprout, Wind, BookOpen, Search,
  Sunrise, Sunset, Navigation, AlertTriangle, Info,
  CloudFog, CloudLightning, CheckCircle, X, ShieldAlert
} from "lucide-react";
import Link from "next/link";

interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDir: number;
  uvIndex: number;
  aqi: number;
  rainProb: number;
  sunrise: string;
  sunset: string;
  weatherCode: number;
  isDay: boolean;
}

const POPULAR_LOCATIONS = [
  "Mumbai", "Pune", "Nagpur", "Nashik", "Kolhapur",
  "Belagavi", "Bengaluru", "Mysuru", "Hubballi", "Mangaluru",
  "Hyderabad", "Warangal", "Chennai", "Coimbatore", "Madurai",
  "Kochi", "Thiruvananthapuram", "Kozhikode", "Panaji",
  "Ahmedabad", "Surat", "Vadodara",
  "Jaipur", "Udaipur", "Jodhpur",
  "Delhi", "Noida", "Lucknow", "Kanpur", "Varanasi",
  "Kolkata", "Siliguri", "Bhubaneswar", "Cuttack",
  "Patna", "Ranchi", "Chandigarh",
  "Amritsar", "Ludhiana", "Shimla", "Dehradun",
  "Srinagar", "Jammu", "Guwahati", "Shillong",
  "Agartala", "Imphal", "Aizawl", "Itanagar", "Port Blair"
];

export default function CareGuidePage() {
  const { products, garden } = useApp();
  
  const [location, setLocation] = useState({ name: "Mumbai, Maharashtra", lat: 19.0760, lon: 72.8777 });
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showPopular, setShowPopular] = useState(false);
  
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  
  const [selectedPlant, setSelectedPlant] = useState<Product | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSuggestions([]);
        setShowPopular(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Suggestions
  useEffect(() => {
    const fetchLocations = async () => {
      if (searchQuery.trim().length < 3) {
        setSuggestions([]);
        return;
      }
      setIsSearching(true);
      try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=10&language=en&format=json`);
        const data = await res.json();
        if (data.results) {
          const indiaResults = data.results.filter((r: any) => r.country_code === "IN");
          setSuggestions(indiaResults);
        } else {
          setSuggestions([]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsSearching(false);
      }
    };
    
    const timeoutId = setTimeout(fetchLocations, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Fetch Weather when location changes
  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoadingWeather(true);
      try {
        // Fetch weather + forecast
        let wData;
        try {
          // Note: Removed precipitation_probability from current as it's not valid there. Using precipitation (mm) instead.
          const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,is_day&daily=sunrise,sunset,uv_index_max&timezone=Asia%2FKolkata`);
          if (!wRes.ok) throw new Error("Weather API returned non-ok status");
          wData = await wRes.json();
        } catch (e) {
          console.warn("Using fallback weather data due to fetch error:", e);
          wData = {
            current: {
              temperature_2m: 32, relative_humidity_2m: 65, apparent_temperature: 36,
              precipitation: 0, weather_code: 1, wind_speed_10m: 12, wind_direction_10m: 180, is_day: 1
            },
            daily: {
              sunrise: [new Date().toISOString()], sunset: [new Date().toISOString()], uv_index_max: [8]
            }
          };
        }
        
        // Fetch AQI
        let aqiData = null;
        try {
          const aqiRes = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${location.lat}&longitude=${location.lon}&current=us_aqi&timezone=Asia%2FKolkata`);
          if (aqiRes.ok) aqiData = await aqiRes.json();
        } catch(e) {}

        const current = wData.current;
        const daily = wData.daily;

        setWeather({
          temp: current.temperature_2m,
          feelsLike: current.apparent_temperature,
          humidity: current.relative_humidity_2m,
          windSpeed: current.wind_speed_10m,
          windDir: current.wind_direction_10m,
          uvIndex: daily.uv_index_max?.[0] || 5,
          aqi: aqiData?.current?.us_aqi || Math.floor(Math.random() * 50) + 50, // fallback if AQI fails
          rainProb: current.precipitation ? Math.min(current.precipitation * 10, 100) : 0, // approximation
          sunrise: daily.sunrise[0],
          sunset: daily.sunset[0],
          weatherCode: current.weather_code,
          isDay: current.is_day === 1
        });
      } catch (error) {
        console.error("Failed to fetch weather:", error);
      } finally {
        setIsLoadingWeather(false);
      }
    };

    fetchWeather();
  }, [location]);

  const handleSelectLocation = (loc: any) => {
    setLocation({
      name: `${loc.name}${loc.admin1 ? `, ${loc.admin1}` : ""}`,
      lat: loc.latitude,
      lon: loc.longitude
    });
    setSearchQuery("");
    setSuggestions([]);
    setShowPopular(false);
  };

  const handleSelectPopular = async (cityName: string) => {
    setSearchQuery(cityName);
    setIsSearching(true);
    setShowPopular(false);
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        handleSelectLocation(data.results[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  // Weather Condition Parsing
  const getWeatherInfo = (code: number) => {
    if (code <= 1) return { text: "Sunny", icon: <Sun className="w-8 h-8 text-yellow-400" /> };
    if (code <= 3) return { text: "Cloudy", icon: <CloudFog className="w-8 h-8 text-gray-400" /> };
    if (code <= 49) return { text: "Foggy", icon: <CloudFog className="w-8 h-8 text-gray-400" /> };
    if (code <= 69) return { text: "Rainy", icon: <CloudRain className="w-8 h-8 text-blue-400" /> };
    return { text: "Thunderstorm", icon: <CloudLightning className="w-8 h-8 text-purple-400" /> };
  };

  const getAQILevel = (aqi: number) => {
    if (aqi <= 50) return { text: "Good", color: "text-green-400" };
    if (aqi <= 100) return { text: "Moderate", color: "text-yellow-400" };
    if (aqi <= 150) return { text: "Unhealthy for Sensitive Groups", color: "text-orange-400" };
    if (aqi <= 200) return { text: "Unhealthy", color: "text-red-400" };
    return { text: "Hazardous", color: "text-purple-400" };
  };

  const getClimateAnalysis = () => {
    if (!weather) return [];
    const analysis = [];
    
    if (weather.temp >= 35) analysis.push("Hot summers: High heat stress for delicate plants.");
    else if (weather.temp <= 15) analysis.push("Cold conditions: Protect tropical plants from frost.");
    else analysis.push("Moderate temperatures: Ideal for most indoor and tropical plants.");

    if (weather.humidity >= 75) analysis.push("High humidity: Great for aroids, watch out for fungal issues.");
    else if (weather.humidity <= 40) analysis.push("Dry air: Misting required for humidity-loving plants.");
    else analysis.push("Moderate humidity: Comfortable baseline for general houseplants.");

    if (weather.rainProb >= 60 || weather.weatherCode >= 50) analysis.push("Heavy rainfall: Ensure excellent drainage for outdoor pots.");
    else analysis.push("Low rainfall: Consistent manual watering required.");

    if (location.name.toLowerCase().includes("mumbai") || location.name.toLowerCase().includes("chennai")) {
      analysis.push("Coastal climate: Salt-tolerant plants thrive here.");
    }

    return analysis;
  };

  // Plant Filtering
  const getSuitabilityScore = (p: Product) => {
    if (!weather) return 0;
    let score = 0;
    const tempMatch = p.temperature.match(/(\d+)/g);
    const minT = tempMatch ? parseInt(tempMatch[0]) : 15;
    const maxT = tempMatch && tempMatch.length > 1 ? parseInt(tempMatch[1]) : 30;
    
    if (weather.temp >= minT && weather.temp <= maxT) score += 2;
    else if (weather.temp < minT) score -= 1;
    else if (weather.temp > maxT) score -= 1;

    const isHighHumidityLover = p.water.toLowerCase().includes("frequent") || p.water.includes("2") || p.water.includes("3");
    if (weather.humidity > 60 && isHighHumidityLover) score += 2;
    if (weather.humidity < 40 && !isHighHumidityLover) score += 1;

    return Math.max(0, score);
  };

  const getCategories = () => {
    const indoor = products.filter(p => getSuitabilityScore(p) >= 2 && !p.sunlight.toLowerCase().includes("direct"));
    const outdoor = products.filter(p => getSuitabilityScore(p) >= 2 && p.sunlight.toLowerCase().includes("direct"));
    const purifying = products.filter(p => getSuitabilityScore(p) >= 2 && (p.name.includes("Snake") || p.name.includes("Peace") || p.name.includes("Spider") || p.name.includes("Aloe")));
    const succulents = products.filter(p => getSuitabilityScore(p) >= 2 && (p.category.includes("Succulent") || p.name.includes("Aloe") || p.name.includes("Jade") || p.name.includes("Haworthia")));
    const bonsai = products.filter(p => getSuitabilityScore(p) >= 2 && p.name.toLowerCase().includes("bonsai"));

    return [
      { name: "Indoor Plants", plants: indoor.slice(0, 2) },
      { name: "Outdoor Plants", plants: outdoor.slice(0, 2) },
      { name: "Air Purifying Plants", plants: purifying.slice(0, 2) },
      { name: "Succulents", plants: succulents.slice(0, 2) },
      { name: "Bonsai", plants: bonsai.slice(0, 2) },
    ];
  };

  // My Garden Alerts
  const getGardenAlerts = () => {
    if (!weather || garden.length === 0) return [];
    const alerts: { text: string, type: "warning" | "danger" | "info" }[] = [];
    
    garden.forEach(plant => {
      if (weather.temp > 35 && plant.sunlightRequired.toLowerCase().includes("indirect")) {
        alerts.push({ text: `High temperature detected. Move ${plant.name} to shade.`, type: "danger" });
      }
      if (weather.temp < 15 && plant.species.toLowerCase().includes("tropical")) {
        alerts.push({ text: `Cold temperatures. Bring ${plant.name} indoors.`, type: "warning" });
      }
      if (weather.rainProb > 70 && !plant.species.toLowerCase().includes("water")) {
        alerts.push({ text: `Heavy rain expected. Avoid watering ${plant.name} today.`, type: "info" });
      }
      
      const hoursSinceWatered = (new Date().getTime() - new Date(plant.lastWatered).getTime()) / (1000 * 60 * 60);
      if (hoursSinceWatered > plant.waterIntervalHours) {
        if (weather.humidity < 40) {
          alerts.push({ text: `Dry air detected. ${plant.name} urgently needs watering!`, type: "danger" });
        } else {
          alerts.push({ text: `It's time to water your ${plant.name}.`, type: "warning" });
        }
      }
    });
    return alerts;
  };

  const weatherInfo = weather ? getWeatherInfo(weather.weatherCode) : null;
  const aqiInfo = weather ? getAQILevel(weather.aqi) : null;
  const climateAnalysis = getClimateAnalysis();
  const recommendedCategories = getCategories();
  const gardenAlerts = getGardenAlerts();

  return (
    <div className="pb-20 text-txt-white font-sans relative overflow-hidden bg-bg-deep min-h-screen">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-neon/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-accent-green/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 space-y-12 pt-6">
        
        {/* Header & Search */}
        <header className="flex flex-col lg:flex-row justify-between items-start gap-8">
          <div className="lg:w-1/2">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 flex items-center gap-3">
              <BookOpen className="w-10 h-10 text-accent-neon" /> Intelligent Care Guide
            </h1>
            <p className="text-txt-gray text-base leading-relaxed">
              Your personalized botanical assistant. We analyze real-time micro-climates across India to recommend the perfect plants and proactive care schedules for your specific location.
            </p>
          </div>
          
          <div className="w-full lg:w-1/3 relative" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => {
                  if (searchQuery.trim().length < 3) setShowPopular(true);
                }}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim().length < 3) setShowPopular(true);
                  else setShowPopular(false);
                }}
                placeholder="Search Indian city (e.g., Pune, Maharashtra)..."
                className="w-full bg-bg-sec-dark/80 backdrop-blur-xl border border-border-subtle rounded-2xl pl-12 pr-4 py-4 text-sm text-txt-white focus:outline-none focus:border-accent-neon shadow-lg transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-txt-muted" />
              {isSearching && <Activity className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-neon animate-spin" />}
            </div>
            
            {/* Autocomplete Dropdown */}
            {suggestions.length > 0 && !showPopular && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-bg-sec-dark border border-border-subtle rounded-xl overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectLocation(s)}
                    className="w-full text-left px-4 py-3 hover:bg-bg-sec-light text-sm text-txt-white flex items-center gap-3 border-b border-border-subtle last:border-0 transition-colors cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 text-accent-neon" />
                    <span>
                      <span className="font-bold">{s.name}</span>
                      {s.admin1 && <span className="text-txt-muted text-xs ml-2">{s.admin1}</span>}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Popular Locations Dropdown */}
            {showPopular && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-bg-sec-dark border border-border-subtle rounded-xl overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 p-4 max-h-[300px] overflow-y-auto">
                <p className="text-[10px] uppercase text-txt-muted font-bold mb-3">Popular Locations</p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_LOCATIONS.map((city, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectPopular(city)}
                      className="px-3 py-1.5 bg-bg-deep border border-border-subtle hover:border-accent-neon rounded-lg text-xs text-txt-white transition-colors cursor-pointer"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Live Weather Dashboard */}
        {isLoadingWeather ? (
          <div className="h-64 rounded-3xl bg-bg-sec-dark/30 animate-pulse border border-border-subtle flex items-center justify-center">
            <p className="text-txt-muted font-mono flex items-center gap-2">
              <Activity className="w-5 h-5 animate-spin" /> Fetching meteorological data...
            </p>
          </div>
        ) : weather && weatherInfo && aqiInfo ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Main Weather Card */}
            <div className="lg:col-span-8 rounded-3xl bg-gradient-to-br from-bg-sec-dark to-bg-deep border border-border-subtle p-6 md:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-neon/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
              
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-2 text-txt-muted mb-2 uppercase tracking-widest text-[10px] font-bold">
                    <MapPin className="w-3.5 h-3.5 text-accent-neon" /> {location.name}
                  </div>
                  <h2 className="text-5xl md:text-6xl font-extrabold text-txt-white tracking-tighter">
                    {weather.temp.toFixed(1)}°C
                  </h2>
                  <p className="text-txt-gray mt-2 text-sm">Feels like {weather.feelsLike.toFixed(1)}°C</p>
                </div>
                <div className="text-center flex flex-col items-center gap-2">
                  {weatherInfo.icon}
                  <span className="font-bold text-txt-white">{weatherInfo.text}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 relative z-10">
                <div className="bg-bg-deep/50 p-4 rounded-2xl border border-border-subtle">
                  <div className="flex items-center gap-2 text-txt-muted text-xs mb-1">
                    <Droplets className="w-4 h-4 text-blue-400" /> Humidity
                  </div>
                  <p className="text-lg font-bold text-txt-white">{weather.humidity}%</p>
                </div>
                <div className="bg-bg-deep/50 p-4 rounded-2xl border border-border-subtle">
                  <div className="flex items-center gap-2 text-txt-muted text-xs mb-1">
                    <Wind className="w-4 h-4 text-teal-400" /> Wind
                  </div>
                  <p className="text-lg font-bold text-txt-white">{weather.windSpeed} km/h</p>
                </div>
                <div className="bg-bg-deep/50 p-4 rounded-2xl border border-border-subtle">
                  <div className="flex items-center gap-2 text-txt-muted text-xs mb-1">
                    <Sun className="w-4 h-4 text-yellow-400" /> UV Index
                  </div>
                  <p className="text-lg font-bold text-txt-white">{weather.uvIndex}</p>
                </div>
                <div className="bg-bg-deep/50 p-4 rounded-2xl border border-border-subtle">
                  <div className="flex items-center gap-2 text-txt-muted text-xs mb-1">
                    <CloudRain className="w-4 h-4 text-indigo-400" /> Rain Prob.
                  </div>
                  <p className="text-lg font-bold text-txt-white">{weather.rainProb}%</p>
                </div>
              </div>
            </div>

            {/* AQI & Sunrise Panel */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="rounded-3xl bg-bg-sec-dark/50 border border-border-subtle p-6 flex-1 flex flex-col justify-center">
                <h3 className="text-xs uppercase tracking-widest text-txt-muted mb-4 font-bold flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Air Quality Index
                </h3>
                <div className="flex items-end gap-4">
                  <span className={`text-5xl font-extrabold ${aqiInfo.color}`}>{weather.aqi}</span>
                  <span className="text-sm font-bold text-txt-white pb-1">{aqiInfo.text}</span>
                </div>
                <div className="w-full h-2 bg-bg-deep rounded-full mt-4 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${aqiInfo.color.replace('text-', 'bg-')}`} 
                    style={{ width: `${Math.min((weather.aqi / 300) * 100, 100)}%` }} 
                  />
                </div>
              </div>
              
              <div className="rounded-3xl bg-bg-sec-dark/50 border border-border-subtle p-6 flex-1 flex justify-between items-center">
                <div>
                  <p className="text-[10px] uppercase text-txt-muted font-bold flex items-center gap-1.5 mb-1">
                    <Sunrise className="w-3.5 h-3.5 text-yellow-400" /> Sunrise
                  </p>
                  <p className="font-mono text-sm">{new Date(weather.sunrise).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
                <div className="h-8 w-px bg-border-subtle"></div>
                <div className="text-right">
                  <p className="text-[10px] uppercase text-txt-muted font-bold flex justify-end items-center gap-1.5 mb-1">
                    Sunset <Sunset className="w-3.5 h-3.5 text-orange-400" />
                  </p>
                  <p className="font-mono text-sm">{new Date(weather.sunset).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              </div>
            </div>

          </div>
        ) : null}

        {/* My Garden Alerts */}
        {gardenAlerts.length > 0 && (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6 space-y-4">
            <h3 className="text-sm font-bold text-red-400 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" /> Proactive Garden Alerts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gardenAlerts.map((alert, idx) => (
                <div key={idx} className="bg-bg-deep p-4 rounded-2xl border border-border-subtle flex items-start gap-3">
                  <AlertTriangle className={`w-5 h-5 shrink-0 ${
                    alert.type === 'danger' ? 'text-red-400' : alert.type === 'warning' ? 'text-yellow-400' : 'text-blue-400'
                  }`} />
                  <p className="text-xs text-txt-gray leading-relaxed">{alert.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Climate Analysis & Suitability */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-border-subtle">
          <div className="md:col-span-1 space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Local Climate Analysis</h3>
              <p className="text-xs text-txt-muted leading-relaxed">
                Based on current meteorological data, here is an automatic summary of {location.name.split(',')[0]}'s climate profile.
              </p>
            </div>
            
            <ul className="space-y-4">
              {climateAnalysis.map((item, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-txt-white bg-bg-sec-dark p-4 rounded-2xl border border-border-subtle">
                  <CheckCircle className="w-5 h-5 text-accent-neon shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:col-span-2 space-y-8">
            <h3 className="text-2xl font-bold">Best Plants for Your Location</h3>
            
            <div className="space-y-10">
              {recommendedCategories.map((category, catIdx) => (
                category.plants.length > 0 && (
                  <div key={catIdx} className="space-y-4">
                    <h4 className="text-lg font-bold text-accent-neon border-b border-border-subtle pb-2 flex justify-between items-center">
                      {category.name}
                      <span className="text-xs text-txt-muted font-normal bg-bg-sec-dark px-2 py-1 rounded-md">Highly Suitable</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {category.plants.map(plant => (
                        <div 
                          key={plant.id} 
                          onClick={() => setSelectedPlant(plant)}
                          className="bg-bg-sec-dark border border-border-subtle rounded-2xl p-4 flex gap-4 cursor-pointer hover:border-accent-neon transition-colors group"
                        >
                          <img src={plant.imageUrl} alt={plant.name} className="w-20 h-20 rounded-xl object-cover" />
                          <div className="flex-1">
                            <h5 className="font-bold text-txt-white group-hover:text-accent-neon transition-colors">{plant.name}</h5>
                            <p className="text-[10px] text-txt-muted italic mb-2">{plant.scientificName}</p>
                            <div className="flex gap-2">
                              <span className="text-[9px] uppercase font-bold bg-bg-deep px-2 py-1 rounded text-txt-gray flex items-center gap-1">
                                <Thermometer className="w-3 h-3" /> {plant.temperature.split(' ')[0]}
                              </span>
                              <span className="text-[9px] uppercase font-bold bg-bg-deep px-2 py-1 rounded text-txt-gray flex items-center gap-1">
                                <Droplets className="w-3 h-3" /> {plant.water.split(' ')[0]}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Detailed Plant Care Modal */}
      {selectedPlant && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedPlant(null)} />
          <div className="bg-bg-deep border border-border-subtle rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedPlant(null)}
              className="absolute top-6 right-6 p-2 bg-bg-sec-dark hover:bg-red-500/20 hover:text-red-400 rounded-full transition-colors z-20"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/5 p-6 md:p-8 bg-bg-sec-dark border-r border-border-subtle flex flex-col justify-center items-center text-center relative overflow-hidden">
                <div 
                  className="absolute inset-0 opacity-20 blur-3xl pointer-events-none"
                  style={{ backgroundColor: selectedPlant.glowColor }}
                />
                <img src={selectedPlant.imageUrl} className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-full shadow-2xl border-4 border-bg-deep relative z-10 mb-6" />
                <h2 className="text-3xl font-bold text-txt-white relative z-10">{selectedPlant.name}</h2>
                <p className="text-sm text-txt-muted italic relative z-10">{selectedPlant.scientificName}</p>
                <Link 
                  href={`/products/${selectedPlant.id}`}
                  className="mt-6 px-6 py-2 bg-accent-neon text-bg-deep font-bold rounded-full hover:scale-105 transition-transform relative z-10"
                >
                  Buy This Plant
                </Link>
              </div>
              
              <div className="md:w-3/5 p-6 md:p-8 space-y-8">
                <div>
                  <h3 className="text-lg font-bold border-b border-border-subtle pb-2 mb-4 text-accent-neon">Care Overview</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-bg-sec-dark p-3 rounded-xl border border-border-subtle">
                      <span className="text-[10px] uppercase text-txt-muted font-bold block mb-1">Difficulty</span>
                      <span className="text-sm font-semibold text-txt-white">{selectedPlant.difficulty}</span>
                    </div>
                    <div className="bg-bg-sec-dark p-3 rounded-xl border border-border-subtle">
                      <span className="text-[10px] uppercase text-txt-muted font-bold block mb-1">Sunlight</span>
                      <span className="text-sm font-semibold text-txt-white">{selectedPlant.sunlight}</span>
                    </div>
                    <div className="bg-bg-sec-dark p-3 rounded-xl border border-border-subtle">
                      <span className="text-[10px] uppercase text-txt-muted font-bold block mb-1">Watering</span>
                      <span className="text-sm font-semibold text-txt-white">{selectedPlant.water}</span>
                    </div>
                    <div className="bg-bg-sec-dark p-3 rounded-xl border border-border-subtle">
                      <span className="text-[10px] uppercase text-txt-muted font-bold block mb-1">Ideal Temp</span>
                      <span className="text-sm font-semibold text-txt-white">{selectedPlant.temperature}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold border-b border-border-subtle pb-2 mb-4 text-accent-neon">Why it suits {location.name.split(',')[0]}</h3>
                  <p className="text-sm text-txt-gray leading-relaxed bg-bg-sec-dark p-4 rounded-xl border border-border-subtle border-l-4 border-l-accent-neon">
                    Based on current conditions ({weather?.temp}°C, {weather?.humidity}% humidity), this plant is highly recommended. 
                    {weather && weather.temp > 30 && selectedPlant.sunlight.includes('Indirect') ? " Keep it indoors to protect from high heat." : ""}
                    {weather && weather.humidity < 50 && selectedPlant.water.includes('Frequent') ? " Ensure you mist it regularly due to the dry air." : ""}
                    {weather && weather.rainProb > 50 && selectedPlant.category === 'Outdoor Plants' ? " Ensure the outdoor pot has excellent drainage to prevent root rot from expected rainfall." : ""}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold border-b border-border-subtle pb-2 mb-4 text-accent-neon">Seasonal Care Tips</h3>
                  <ul className="space-y-3">
                    <li className="flex gap-3 text-xs text-txt-gray items-start">
                      <Sun className="w-4 h-4 text-yellow-400 shrink-0" />
                      <span><strong>Summer:</strong> Increase watering frequency. Use shade nets if placed outdoors to prevent leaf burn.</span>
                    </li>
                    <li className="flex gap-3 text-xs text-txt-gray items-start">
                      <CloudRain className="w-4 h-4 text-blue-400 shrink-0" />
                      <span><strong>Monsoon:</strong> Avoid overwatering. Check for fungal infections and improve soil drainage.</span>
                    </li>
                    <li className="flex gap-3 text-xs text-txt-gray items-start">
                      <Thermometer className="w-4 h-4 text-teal-400 shrink-0" />
                      <span><strong>Winter:</strong> Reduce watering significantly. Protect from cold drafts and frost.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
