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
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Message de bienvenue */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold tracking-tight">Bienvenue</h2>
              <p className="text-xl text-muted-foreground">
                {formattedDate}
              </p>
            </div>

            {/* Météo */}
            <div className="flex justify-center pt-4 border-t">
              <WeatherCard />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
