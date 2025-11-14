
import React, { useState, useEffect, useCallback } from "react";
import { Store } from "@/entities/Store";
import { Rating } from "@/entities/Rating";
import { User } from "@/entities/User";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Star, Leaf, MapPin, MessageSquare, TrendingUp, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import MetricDisplay from "../components/stores/MetricDisplay";
import RatingForm from "../components/stores/RatingForm";
import ReviewCard from "../components/stores/ReviewCard";
import MetricChart from "../components/dashboard/MetricChart";

export default function StoreDetails() {
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const urlParams = new URLSearchParams(window.location.search);
  const storeId = urlParams.get("id");

  const loadData = useCallback(async () => {
    if (!storeId) return;

    const [storeData, ratingsData] = await Promise.all([
      Store.filter({ id: storeId }),
      Rating.filter({ store_id: storeId }, "-created_date")
    ]);

    if (storeData.length > 0) {
      setStore(storeData[0]);
    }
    setRatings(ratingsData);

    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.log("User not logged in");
    }
  }, [storeId]); // `storeId` is a dependency for `loadData`

  useEffect(() => {
    loadData();
  }, [loadData]); // `loadData` is a dependency for `useEffect`

  const generateAIExplanation = async () => {
    if (!store) return;
    
    setLoadingAI(true);
    try {
      const avgRatings = calculateAverageRatings();
      const prompt = `As a sustainability expert, provide a brief, friendly explanation (2-3 sentences) of why this store received the following sustainability scores:
      
      Energy Efficiency: ${store.energy_efficiency}/5 (Community: ${avgRatings.energy_efficiency.toFixed(1)}/5)
      Waste Management: ${store.waste_management}/5 (Community: ${avgRatings.waste_management.toFixed(1)}/5)
      Product Sourcing: ${store.product_sourcing}/5 (Community: ${avgRatings.product_sourcing.toFixed(1)}/5)
      Carbon Footprint: ${store.carbon_footprint}/5 (Community: ${avgRatings.carbon_footprint.toFixed(1)}/5)
      Community Engagement: ${store.community_engagement}/5 (Community: ${avgRatings.community_engagement.toFixed(1)}/5)
      
      Focus on the strengths and areas for improvement. Be encouraging and specific.`;
      
      const response = await InvokeLLM({ prompt });
      setAiExplanation(response);
    } catch (error) {
      setAiExplanation("Unable to generate explanation at this time.");
    }
    setLoadingAI(false);
  };

  const handleSubmitRating = async (ratingData) => {
    if (!user) {
      alert("Please log in to submit a rating.");
      return;
    }

    setIsSubmitting(true);
    try {
      await Rating.create({
        store_id: store.id,
        store_name: store.name,
        user_email: user.email,
        user_name: user.full_name,
        ...ratingData
      });
      
      await loadData();
      setActiveTab("reviews");
    } catch (error) {
      alert("Error submitting rating. Please try again.");
    }
    setIsSubmitting(false);
  };

  const calculateOverallScore = () => {
    if (!store) return 0;
    return (
      (store.energy_efficiency +
        store.waste_management +
        store.product_sourcing +
        store.carbon_footprint +
        store.community_engagement) / 5
    );
  };

  const calculateAverageRatings = () => {
    if (ratings.length === 0) {
      return {
        energy_efficiency: 0,
        waste_management: 0,
        product_sourcing: 0,
        carbon_footprint: 0,
        community_engagement: 0,
        overall: 0
      };
    }

    const sum = ratings.reduce((acc, rating) => ({
      energy_efficiency: acc.energy_efficiency + rating.energy_efficiency,
      waste_management: acc.waste_management + rating.waste_management,
      product_sourcing: acc.product_sourcing + rating.product_sourcing,
      carbon_footprint: acc.carbon_footprint + rating.carbon_footprint,
      community_engagement: acc.community_engagement + rating.community_engagement,
      overall: acc.overall + rating.overall_rating
    }), {
      energy_efficiency: 0,
      waste_management: 0,
      product_sourcing: 0,
      carbon_footprint: 0,
      community_engagement: 0,
      overall: 0
    });

    return {
      energy_efficiency: sum.energy_efficiency / ratings.length,
      waste_management: sum.waste_management / ratings.length,
      product_sourcing: sum.product_sourcing / ratings.length,
      carbon_footprint: sum.carbon_footprint / ratings.length,
      community_engagement: sum.community_engagement / ratings.length,
      overall: sum.overall / ratings.length
    };
  };

  const getChartData = () => {
    if (!store) return [];
    const avgRatings = calculateAverageRatings();
    
    return [
      { name: "Energy", system: store.energy_efficiency, community: avgRatings.energy_efficiency },
      { name: "Waste", system: store.waste_management, community: avgRatings.waste_management },
      { name: "Sourcing", system: store.product_sourcing, community: avgRatings.product_sourcing },
      { name: "Carbon", system: store.carbon_footprint, community: avgRatings.carbon_footprint },
      { name: "Community", system: store.community_engagement, community: avgRatings.community_engagement }
    ];
  };

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading store details...</p>
        </div>
      </div>
    );
  }

  const overallScore = calculateOverallScore();
  const avgRatings = calculateAverageRatings();

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("Home"))}
          className="mb-6 hover:bg-emerald-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Stores
        </Button>

        {/* Store Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm shadow-xl mb-8">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center flex-shrink-0">
                      <Leaf className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                          {store.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <MapPin className="w-4 h-4" />
                        <span>{store.location || "Location not specified"}</span>
                      </div>
                      {store.description && (
                        <p className="text-gray-700 leading-relaxed">{store.description}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100">
                  <div className="text-center mb-4">
                    <div className="text-5xl font-bold text-emerald-600 mb-2">
                      {overallScore.toFixed(1)}
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.round(overallScore)
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm font-medium text-gray-700">System Rating</p>
                  </div>

                  {ratings.length > 0 && (
                    <div className="pt-4 border-t border-emerald-200">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-1">
                          {avgRatings.overall.toFixed(1)}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Community Average</p>
                        <p className="text-xs text-gray-500">{ratings.length} reviews</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/80 backdrop-blur-sm border border-emerald-100">
            <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              Reviews ({ratings.length})
            </TabsTrigger>
            <TabsTrigger value="rate" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              Rate Store
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Sustainability Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <MetricDisplay
                  metric="energy_efficiency"
                  value={store.energy_efficiency}
                  userAverage={ratings.length > 0 ? avgRatings.energy_efficiency : null}
                />
                <MetricDisplay
                  metric="waste_management"
                  value={store.waste_management}
                  userAverage={ratings.length > 0 ? avgRatings.waste_management : null}
                />
                <MetricDisplay
                  metric="product_sourcing"
                  value={store.product_sourcing}
                  userAverage={ratings.length > 0 ? avgRatings.product_sourcing : null}
                />
                <MetricDisplay
                  metric="carbon_footprint"
                  value={store.carbon_footprint}
                  userAverage={ratings.length > 0 ? avgRatings.carbon_footprint : null}
                />
                <MetricDisplay
                  metric="community_engagement"
                  value={store.community_engagement}
                  userAverage={ratings.length > 0 ? avgRatings.community_engagement : null}
                />
              </CardContent>
            </Card>

            <MetricChart
              data={getChartData()}
              title="Performance Comparison"
              description="System ratings vs. community feedback"
            />
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            {ratings.length === 0 ? (
              <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                  <p className="text-gray-600 mb-4">Be the first to share your experience!</p>
                  <Button
                    onClick={() => setActiveTab("rate")}
                    className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                  >
                    Write a Review
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {ratings.map((rating) => (
                  <ReviewCard key={rating.id} rating={rating} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="rate">
            <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  Rate This Store
                </CardTitle>
                <p className="text-sm text-gray-600 mt-2">
                  Your feedback helps others make informed sustainable shopping decisions.
                </p>
              </CardHeader>
              <CardContent>
                <RatingForm onSubmit={handleSubmitRating} isSubmitting={isSubmitting} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    AI-Powered Explanation
                  </CardTitle>
                  <Button
                    onClick={generateAIExplanation}
                    disabled={loadingAI}
                    size="sm"
                    variant="outline"
                    className="border-purple-200 hover:bg-purple-50"
                  >
                    {loadingAI ? "Generating..." : "Generate Explanation"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {aiExplanation ? (
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                    <p className="text-gray-700 leading-relaxed">{aiExplanation}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Click "Generate Explanation" to get AI-powered insights about this store's sustainability performance.
                  </p>
                )}
              </CardContent>
            </Card>

            <MetricChart
              data={getChartData()}
              title="Detailed Performance Breakdown"
              description="Visual comparison of system and community ratings"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
