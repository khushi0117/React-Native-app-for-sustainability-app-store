import React, { useState, useEffect } from "react";
import { Rating } from "@/entities/Rating";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User as UserIcon, Star, Award, TrendingUp, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import ReviewCard from "../components/stores/ReviewCard";

export default function MyProfile() {
  const [user, setUser] = useState(null);
  const [myRatings, setMyRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const allRatings = await Rating.filter({ user_email: currentUser.email }, "-created_date");
      setMyRatings(allRatings);
    } catch (error) {
      console.log("User not logged in");
    }
    setIsLoading(false);
  };

  const calculateStats = () => {
    if (myRatings.length === 0) {
      return {
        totalReviews: 0,
        avgRating: 0,
        topCategory: "N/A",
        contributionLevel: "New User"
      };
    }

    const avgRating = myRatings.reduce((sum, r) => sum + r.overall_rating, 0) / myRatings.length;
    
    let contributionLevel = "New User";
    if (myRatings.length >= 20) contributionLevel = "Sustainability Champion";
    else if (myRatings.length >= 10) contributionLevel = "Eco Advocate";
    else if (myRatings.length >= 5) contributionLevel = "Active Contributor";

    const categoryCount = {};
    myRatings.forEach(r => {
      const category = r.store_name || "Unknown";
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    
    const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    return {
      totalReviews: myRatings.length,
      avgRating: avgRating.toFixed(1),
      topCategory,
      contributionLevel
    };
  };

  const handleLogout = async () => {
    await User.logout();
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-emerald-100 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
            <p className="text-gray-600 mb-6">
              Please sign in to view your profile and sustainability contributions.
            </p>
            <Button
              onClick={() => User.login()}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
            >
              Sign In with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Profile Header */}
          <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm shadow-xl mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-12 h-12 text-white" />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.full_name}</h1>
                  <p className="text-gray-600 mb-3">{user.email}</p>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0">
                      {stats.contributionLevel}
                    </Badge>
                    <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                      {user.role === "admin" ? "Admin" : "User"}
                    </Badge>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <ProfileStatCard
            icon={Star}
            label="Total Reviews"
            value={stats.totalReviews}
            color="bg-amber-100 text-amber-600"
          />
          <ProfileStatCard
            icon={TrendingUp}
            label="Avg Rating"
            value={stats.avgRating}
            color="bg-emerald-100 text-emerald-600"
          />
          <ProfileStatCard
            icon={Award}
            label="Contribution"
            value={stats.contributionLevel.split(" ")[0]}
            color="bg-purple-100 text-purple-600"
          />
          <ProfileStatCard
            icon={UserIcon}
            label="Member Since"
            value={new Date(user.created_date).getFullYear()}
            color="bg-blue-100 text-blue-600"
          />
        </div>

        {/* My Reviews */}
        <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-emerald-600" />
              My Reviews ({myRatings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {myRatings.length === 0 ? (
              <div className="text-center py-12">
                <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-600">
                  Start contributing by rating stores and sharing your sustainability insights!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {myRatings.map((rating) => (
                  <ReviewCard key={rating.id} rating={rating} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProfileStatCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mx-auto mb-3`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
          <div className="text-sm text-gray-600">{label}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
