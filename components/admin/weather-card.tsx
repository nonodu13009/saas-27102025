"use client";

import { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, Wind } from "lucide-react";

interface WeatherData {
  temp: string;
  description: string;
  icon: string;
}

export function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // API météo gratuite wttr.in (pas besoin de clé)
        const response = await fetch(
          'https://wttr.in/Marseille?format=%t+%C&lang=fr'
        );
        
        if (response.ok) {
          const data = await response.text();
          const parts = data.trim().split(' ');
          const temp = parts[0]?.replace('+', '') || 'N/A';
          const desc = parts.slice(1).join(' ').toLowerCase() || '';
          
          setWeather({
            temp: temp,
            description: desc,
            icon: '',
          });
        }
      } catch (error) {
        console.error("Erreur API météo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <Cloud className="h-8 w-8 animate-pulse text-muted-foreground" />
        <div>
          <p className="text-sm text-muted-foreground">Chargement météo...</p>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="flex items-center gap-3">
        <Cloud className="h-8 w-8 text-muted-foreground" />
        <div>
          <p className="text-sm text-muted-foreground">Météo non disponible</p>
        </div>
      </div>
    );
  }

  const getWeatherIcon = () => {
    const desc = weather.description.toLowerCase();
    if (desc.includes('ensoleillé') || desc.includes('soleil') || desc.includes('clear')) {
      return <Sun className="h-5 w-5 text-yellow-500" />;
    } else if (desc.includes('pluie') || desc.includes('rain')) {
      return <CloudRain className="h-5 w-5 text-blue-500" />;
    } else {
      return <Cloud className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {getWeatherIcon()}
      <span className="text-base">
        {weather.temp}
      </span>
      {weather.description && (
        <span className="text-sm text-muted-foreground capitalize">
          {weather.description}
        </span>
      )}
    </div>
  );
}

