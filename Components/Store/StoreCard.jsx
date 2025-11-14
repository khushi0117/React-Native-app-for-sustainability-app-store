import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function StoreCard({ store, onClick }) {
  const calculateOverallScore = () => {
    return (
      (store.energy_efficiency +
        store.waste_management +
        store.product_sourcing +
        store.carbon_footprint +
        store.community_engagement) / 5
    ).toFixed(1);
  };

  const getScoreColor = (score) => {
    if (score >= 4.5) return "text-emerald-600";
    if (score >= 3.5) return "text-green-600";
    if (score >= 2.5) return "text-yellow-600";
    return "text-orange-600";
  };

  const getScoreBadge = (score) => {
    if (score >= 4.5) return { label: "Excellent", class: "bg-emerald-100 text-emerald-700 border-emerald-200" };
    if (score >= 3.5) return { label: "Good", class: "bg-green-100 text-green-700 border-green-200" };
    if (score >= 2.5) return { label: "Fair", class: "bg-yellow-100 text-yellow-700 border-yellow-200" };
    return { label: "Needs Improvement", class: "bg-orange-100 text-orange-700 border-orange-200" };
  };

  const score = calculateOverallScore();
  const scoreBadge = getScoreBadge(parseFloat(score));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card 
        className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border-emerald-100 bg-white/90 backdrop-blur-sm"
        onClick={onClick}
      >
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-100 to-green-100">
          {store.image_url ? (
            <img 
              src={store.image_url} 
              alt={store.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Leaf className="w-16 h-16 text-emerald-300" />
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Badge className={`${scoreBadge.class} border font-semibold shadow-lg`}>
              {scoreBadge.label}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{store.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{store.location || "Location not specified"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-emerald-100">
            <div className="flex items-center gap-2">
              <div className={`text-3xl font-bold ${getScoreColor(parseFloat(score))}`}>
                {score}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(parseFloat(score))
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">Sustainability Score</span>
              </div>
            </div>

            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              {store.category}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
