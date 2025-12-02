"use client";

import { useState } from "react";
import { CheckCircle, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TourTabsProps {
  itinerary: { day: number; title: string; description: string }[];
  included: string[];
  excluded: string[];
  hotelInfo: { 
    name: string; 
    stars: number; 
    description: string;
    medinaHotel?: string | null;
    kaabaDistance?: number | null;
  };
}

export function TourTabs({ itinerary, included, excluded, hotelInfo }: TourTabsProps) {
  const [activeTab, setActiveTab] = useState<"program" | "otel" | "dahil">("program");
  const [openItem, setOpenItem] = useState<string | null>("day-1");

  const handleToggle = (value: string) => {
    setOpenItem(openItem === value ? null : value);
  };

  return (
    <div className="mt-10">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
        {[
          { id: "program", label: "Tur Programı" },
          { id: "otel", label: "Otel Bilgileri" },
          { id: "dahil", label: "Fiyata Dahil Olanlar" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-6 py-4 text-sm md:text-base font-semibold whitespace-nowrap transition-colors relative",
              activeTab === tab.id
                ? "text-secondary"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="min-h-[300px]">
        {/* Tur Programı */}
        {activeTab === "program" && (
          <Accordion className="space-y-4">
            {itinerary.map((day) => (
              <AccordionItem
                key={`day-${day.day}`}
                value={`day-${day.day}`}
                isOpen={openItem === `day-${day.day}`}
                onToggle={() => handleToggle(`day-${day.day}`)}
              >
                <AccordionTrigger className="hover:text-secondary group">
                  <span className="flex items-center gap-3">
                    <span className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors",
                      openItem === `day-${day.day}` ? "bg-secondary text-white" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                    )}>
                      {day.day}
                    </span>
                    <span>{day.title}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-11 text-gray-600 leading-relaxed">
                    {day.description}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        {/* Otel Bilgileri */}
        {activeTab === "otel" && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-primary mb-2">{hotelInfo.name}</h3>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={cn("text-xl", i < hotelInfo.stars ? "text-yellow-400" : "text-gray-200")}>★</span>
                  ))}
                </div>
              </div>
              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Mekke (350m)
              </span>
            </div>
            <p className="text-gray-600 leading-relaxed">{hotelInfo.description}</p>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <Clock className="h-4 w-4 text-secondary" />
                    7/24 Oda Servisi
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    Ücretsiz Wi-Fi
                </div>
            </div>
          </div>
        )}

        {/* Dahil Olanlar */}
        {activeTab === "dahil" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100">
              <h4 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" /> Fiyata Dahil
              </h4>
              <ul className="space-y-3">
                {included.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100">
              <h4 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
                <span className="text-xl font-bold">×</span> Fiyata Dahil Değil
              </h4>
              <ul className="space-y-3">
                {excluded.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


