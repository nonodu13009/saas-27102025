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
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Bonjour !
              </h2>
            </div>
            <div className="text-center">
              <span className="text-xl font-semibold text-orange-600 dark:text-orange-500">
                {formattedDate}
              </span>
            </div>
            <div className="text-center">
              <WeatherCard />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
