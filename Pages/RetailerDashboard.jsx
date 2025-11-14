
import React, { useState, useEffect } from "react";
import { Store } from "@/entities/Store";
import { Rating } from "@/entities/Rating";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, Star, AlertCircle, Store as StoreIcon } from "lucide-react";
import { motion } from "framer-motion";
import MetricChart from "../components/dashboard/MetricChart";
import InsightCard from "../components/dashboard/InsightCard";

export default function RetailerDashboard() {
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const allStores = await Store.list("-created_date");
      const allRatings = await Rating.list("-created_date");

      setStores(allStores);
      setRatings(allRatings);
    } catch (error) {
      console.log("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const calculateStoreMetrics = (storeId) => {
    const storeRatings = ratings.filter(r => r.store_id === storeId);
    if (storeRatings.length === 0) return null;

    const avgOverall = storeRatings.reduce((sum, r) => sum + r.overall_rating, 0) / storeRatings.length;
    
    return {
      avgRating: avgOverall,
      totalReviews: storeRatings.length,
      avgEnergy: storeRatings.reduce((sum, r) => sum + r.energy_efficiency, 0) / storeRatings.length,
      avgWaste: storeRatings.reduce((sum, r) => sum + r.waste_management, 0) / storeRatings.length,
      avgSourcing: storeRatings.reduce((sum, r) => sum + r.product_sourcing, 0) / storeRatings.length,
      avgCarbon: storeRatings.reduce((sum, r) => sum + r.carbon_footprint, 0) / storeRatings.length,
      avgCommunity: storeRatings.reduce((sum, r) => sum + r.community_engagement, 0) / storeRatings.length
    };
  };

  const generateInsights = () => {
    if (stores.length === 0) return [];

    const insights = [];
    const avgStoreScore = stores.reduce((sum, s) => 
      sum + (s.energy_efficiency + s.waste_management + s.product_sourcing + s.carbon_footprint + s.community_engagement) / 5, 0
    ) / stores.length;

    stores.forEach(store => {
      const storeScore = (store.energy_efficiency + store.waste_management + store.product_sourcing + store.carbon_footprint + store.community_engagement) / 5;
      const metrics = calculateStoreMetrics(store.id);

      // Low energy efficiency
      if (store.energy_efficiency < 3.5) {
        insights.push({
          type: "warning",
          title: `${store.name}: Low Energy Efficiency`,
          description: "Consider implementing LED lighting, energy-efficient appliances, and renewable energy sources to improve this score.",
          metric: "Energy Efficiency"
        });
      }

      // Good waste management
      if (store.waste_management >= 4.0) {
        insights.push({
          type: "opportunity",
          title: `${store.name}: Excellent Waste Management`,
          description: "Your waste management practices are exemplary. Share your methods with other stores to lead by example.",
          metric: "Waste Management"
        });
      }

      // Community rating significantly different from system
      if (metrics && Math.abs(metrics.avgRating - storeScore) > 1.0) {
        if (metrics.avgRating > storeScore) {
          insights.push({
            type: "opportunity",
            title: `${store.name}: Community Loves You!`,
            description: "Customer ratings exceed system benchmarks. This positive perception is a competitive advantage.",
            metric: "Overall Performance"
          });
        } else {
          insights.push({
            type: "suggestion",
            title: `${store.name}: Perception Gap`,
            description: "There's a gap between system ratings and customer perception. Improve customer communication about your sustainability efforts.",
            metric: "Communication"
          });
        }
      }

      // Low carbon footprint potential
      if (store.carbon_footprint < 3.0) {
        insights.push({
          type: "suggestion",
          title: `${store.name}: Carbon Reduction Opportunity`,
          description: "Focus on local sourcing, optimize delivery routes, and consider carbon offset programs to improve your footprint.",
          metric: "Carbon Footprint"
        });
      }
    });

    return insights.slice(0, 6);
  };

  const getOverallStats = () => {
    const totalStores = stores.length;
    const avgSystemRating = stores.length > 0 
      ? stores.reduce((sum, s) => sum + (s.energy_efficiency + s.waste_management + s.product_sourcing + s.carbon_footprint + s.community_engagement) / 5, 0) / stores.length 
      : 0;
    const totalReviews = ratings.length;
    const avgCommunityRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.overall_rating, 0) / ratings.length
      : 0;

    return {
      totalStores,
      avgSystemRating,
      totalReviews,
      avgCommunityRating
    };
  };

  const getCategoryBreakdown = () => {
    const categoryData = {};
    
    stores.forEach(store => {
      if (!categoryData[store.category]) {
        categoryData[store.category] = {
          count: 0,
          totalScore: 0
        };
      }
      categoryData[store.category].count++;
      categoryData[store.category].totalScore += (store.energy_efficiency + store.waste_management + store.product_sourcing + store.carbon_footprint + store.community_engagement) / 5;
    });

    return Object.entries(categoryData).map(([category, data]) => ({
      name: category,
      stores: data.count,
      avgScore: (data.totalScore / data.count).toFixed(1)
    }));
  };

  const stats = getOverallStats();
  const insights = generateInsights();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Retailer Dashboard
          </h1>
          <p className="text-gray-600">
            Insights and analytics to help improve your sustainability performance
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={StoreIcon}
            label="Total Stores"
            value={stats.totalStores}
            trend="+12%"
            trendUp={true}
          />
          <StatCard
            icon={Star}
            label="Avg System Rating"
            value={stats.avgSystemRating.toFixed(1)}
            trend="+0.3"
            trendUp={true}
          />
          <StatCard
            icon={Users}
            label="Community Reviews"
            value={stats.totalReviews}
            trend="+28"
            trendUp={true}
          />
          <StatCard
            icon={TrendingUp}
            label="Community Rating"
            value={stats.avgCommunityRating.toFixed(1)}
            trend={stats.avgCommunityRating > stats.avgSystemRating ? "+0.2" : "-0.1"}
            trendUp={stats.avgCommunityRating > stats.avgSystemRating}
          />
        </div>

        {/* Insights Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-emerald-600" />
            AI-Powered Insights
          </h2>
          
          {insights.length === 0 ? (
            <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <p className="text-gray-600">No insights available yet. Add more stores and gather reviews to see personalized recommendations.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight, index) => (
                <InsightCard key={index} {...insight} />
              ))}
            </div>
          )}
        </div>

        {/* Store Performance */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Store Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stores.slice(0, 5).map(store => {
                  const score = (store.energy_efficiency + store.waste_management + store.product_sourcing + store.carbon_footprint + store.community_engagement) / 5;
                  const metrics = calculateStoreMetrics(store.id);
                  
                  return (
                    <div key={store.id} className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{store.name}</h3>
                        <p className="text-sm text-gray-600">{store.category}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-600">{score.toFixed(1)}</div>
                        {metrics && (
                          <div className="text-xs text-gray-500">
                            {metrics.totalReviews} reviews
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getCategoryBreakdown().map(category => (
                  <div key={category.name} className="flex items-center justify-between p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.stores} stores</p>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{category.avgScore}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, trend, trendUp }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${trendUp ? 'from-emerald-400 to-green-500' : 'from-orange-400 to-red-500'} flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-semibold ${trendUp ? 'text-green-600' : 'text-orange-600'}`}>
              {trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {trend}
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
          <div className="text-sm text-gray-600">{label}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
