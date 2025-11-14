import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, TrendingUp, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

const iconMap = {
  warning: AlertCircle,
  opportunity: TrendingUp,
  suggestion: Lightbulb
};

const colorMap = {
  warning: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", icon: "text-orange-600" },
  opportunity: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon: "text-blue-600" },
  suggestion: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", icon: "text-emerald-600" }
};

export default function InsightCard({ type, title, description, metric }) {
  const Icon = iconMap[type];
  const colors = colorMap[type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card className={`${colors.bg} border ${colors.border}`}>
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${colors.icon}`} />
            </div>
            
            <div className="flex-1">
              <h3 className={`font-semibold mb-1 ${colors.text}`}>{title}</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
              {metric && (
                <div className="mt-3 text-xs font-medium text-gray-600">
                  Focus Area: <span className="text-gray-900">{metric}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
