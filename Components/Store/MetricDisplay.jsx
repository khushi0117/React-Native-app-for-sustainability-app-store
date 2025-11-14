import React from "react";
import { Zap, Trash2, ShoppingBag, CloudOff, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const metricIcons = {
  energy_efficiency: { icon: Zap, color: "text-yellow-600", bg: "bg-yellow-100" },
  waste_management: { icon: Trash2, color: "text-green-600", bg: "bg-green-100" },
  product_sourcing: { icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-100" },
  carbon_footprint: { icon: CloudOff, color: "text-purple-600", bg: "bg-purple-100" },
  community_engagement: { icon: Users, color: "text-pink-600", bg: "bg-pink-100" }
};

const metricLabels = {
  energy_efficiency: "Energy Efficiency",
  waste_management: "Waste Management",
  product_sourcing: "Product Sourcing",
  carbon_footprint: "Carbon Footprint",
  community_engagement: "Community Engagement"
};

export default function MetricDisplay({ metric, value, userAverage }) {
  const Icon = metricIcons[metric].icon;
  const percentage = (value / 5) * 100;
  const userPercentage = userAverage ? (userAverage / 5) * 100 : null;

  return (
    <div className="p-4 rounded-xl border border-emerald-100 bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl ${metricIcons[metric].bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-6 h-6 ${metricIcons[metric].color}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900">{metricLabels[metric]}</h4>
            <span className="text-lg font-bold text-emerald-600">{value.toFixed(1)}</span>
          </div>
          
          <div className="space-y-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">System Rating</span>
              </div>
              <Progress value={percentage} className="h-2 bg-emerald-50" />
            </div>
            
            {userPercentage !== null && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Community Average</span>
                  <span className="text-xs font-medium text-gray-700">{userAverage.toFixed(1)}</span>
                </div>
                <Progress value={userPercentage} className="h-2 bg-blue-50" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
