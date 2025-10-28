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
    <div>
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <h2 className="text-3xl font-bold">Bonjour !</h2>
            <span className="text-xl text-muted-foreground">
              {formattedDate}
            </span>
            <WeatherCard />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
