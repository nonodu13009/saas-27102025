"use client";

import { Card, CardContent } from "@/components/ui/card";
import { WeatherCard } from "@/components/admin/weather-card";

export default function AdminHome() {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">Bienvenue</h2>
            <p className="text-xl text-muted-foreground">
              {formattedDate}
            </p>
          </div>
        </CardContent>
      </Card>

      <WeatherCard />
    </div>
  );
}
