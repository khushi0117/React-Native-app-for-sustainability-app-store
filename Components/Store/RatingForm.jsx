import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const metrics = [
  { key: "energy_efficiency", label: "Energy Efficiency" },
  { key: "waste_management", label: "Waste Management" },
  { key: "product_sourcing", label: "Product Sourcing" },
  { key: "carbon_footprint", label: "Carbon Footprint" },
  { key: "community_engagement", label: "Community Engagement" }
];

export default function RatingForm({ onSubmit, isSubmitting }) {
  const [ratings, setRatings] = useState({
    energy_efficiency: 0,
    waste_management: 0,
    product_sourcing: 0,
    carbon_footprint: 0,
    community_engagement: 0
  });
  const [comment, setComment] = useState("");
  const [hoveredMetric, setHoveredMetric] = useState(null);
  const [hoveredStar, setHoveredStar] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const allRated = Object.values(ratings).every(r => r > 0);
    if (!allRated) {
      alert("Please rate all sustainability metrics before submitting.");
      return;
    }

    const overall = Object.values(ratings).reduce((sum, val) => sum + val, 0) / 5;
    
    onSubmit({
      ...ratings,
      overall_rating: overall,
      comment: comment.trim()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {metrics.map((metric) => (
          <motion.div
            key={metric.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 rounded-xl border border-emerald-100 bg-white/80 backdrop-blur-sm"
            onMouseEnter={() => setHoveredMetric(metric.key)}
            onMouseLeave={() => setHoveredMetric(null)}
          >
            <div className="flex items-center justify-between mb-2">
              <label className="font-medium text-gray-900">{metric.label}</label>
              <span className="text-sm font-semibold text-emerald-600">
                {ratings[metric.key] > 0 ? `${ratings[metric.key]}.0` : "Not rated"}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatings({ ...ratings, [metric.key]: star })}
                  onMouseEnter={() => setHoveredStar({ ...hoveredStar, [metric.key]: star })}
                  onMouseLeave={() => setHoveredStar({ ...hoveredStar, [metric.key]: 0 })}
                  className="transition-transform duration-200 hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredStar[metric.key] || ratings[metric.key])
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-2">
        <label className="font-medium text-gray-900 block">
          Share Your Experience (Optional)
        </label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us about your experience with this store's sustainability practices..."
          className="min-h-32 border-emerald-100 focus:border-emerald-300"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {isSubmitting ? "Submitting..." : "Submit Rating"}
      </Button>
    </form>
  );
}
