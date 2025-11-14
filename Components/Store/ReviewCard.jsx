import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, User } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function ReviewCard({ rating }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{rating.user_name || "Anonymous"}</h4>
                <span className="text-xs text-gray-500">
                  {format(new Date(rating.created_date), "MMM d, yyyy")}
                </span>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(rating.overall_rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-emerald-600">
                  {rating.overall_rating.toFixed(1)}
                </span>
              </div>
              
              {rating.comment && (
                <p className="text-sm text-gray-700 leading-relaxed">{rating.comment}</p>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4 pt-4 border-t border-emerald-50">
                <MetricBadge label="Energy" value={rating.energy_efficiency} />
                <MetricBadge label="Waste" value={rating.waste_management} />
                <MetricBadge label="Sourcing" value={rating.product_sourcing} />
                <MetricBadge label="Carbon" value={rating.carbon_footprint} />
                <MetricBadge label="Community" value={rating.community_engagement} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function MetricBadge({ label, value }) {
  return (
    <div className="text-center p-2 rounded-lg bg-emerald-50">
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      <div className="text-sm font-bold text-emerald-600">{value.toFixed(1)}</div>
    </div>
  );
}
