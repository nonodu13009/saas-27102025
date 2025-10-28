"use client";

import { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, Wind } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
}

export function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // API météo gratuite OpenWeatherMap
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Marseille&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=metric&lang=fr`
        );
        
        if (response.ok) {
          const data = await response.json();
          setWeather({
            temp: Math.round(data.main.temp),
            description: data.weather[0].description,
            icon: data.weather[0].icon,
          });
        } else {
          console.error("Erreur récupération météo");
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
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Cloud className="h-8 w-8 animate-pulse text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Chargement météo...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Cloud className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Météo non disponible</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getWeatherIcon = () => {
    if (weather.icon.includes("01d") || weather.icon.includes("01n")) {
      return <Sun className="h-12 w-12 text-yellow-500" />;
    } else if (weather.icon.includes("09d") || weather.icon.includes("10d") || weather.icon.includes("09n") || weather.icon.includes("10n")) {
      return <CloudRain className="h-12 w-12 text-blue-500" />;
    } else {
      return <Cloud className="h-12 w-12 text-gray-500" />;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {getWeatherIcon()}
            <div>
              <p className="text-sm text-muted-foreground">Marseille</p>
              <p className="text-2xl font-bold">{weather.temp}°C</p>
              <p className="text-sm capitalize">{weather.description}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

