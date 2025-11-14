import React, { useState, useEffect } from "react";
import { Store } from "@/entities/Store";
import { Rating } from "@/entities/Rating";
import { Input } from "@/components/ui/input";
import { Search, Leaf, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import StoreCard from "../components/stores/StoreCard";

const categories = ["All", "Grocery", "Fashion", "Electronics", "Home & Garden", "Restaurant", "Beauty & Personal Care", "Sports & Outdoor"];

export default function Home() {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    setIsLoading(true);
    const data = await Store.list("-created_date");
    setStores(data);
    setIsLoading(false);
  };

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (store.location && store.location.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || store.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl mb-4 shadow-lg">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover Sustainable Stores
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Make informed eco-friendly shopping choices. Rate and review stores based on their sustainability practices.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-emerald-100">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search stores by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 border-emerald-100 focus:border-emerald-300"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-12 border-emerald-100 focus:border-emerald-300">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <SelectValue placeholder="Filter by category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Stats Banner */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <StatCard label="Total Stores" value={stores.length} />
          <StatCard label="Categories" value={new Set(stores.map(s => s.category)).size} />
          <StatCard label="Avg Rating" value={stores.length > 0 ? (stores.reduce((sum, s) => sum + ((s.energy_efficiency + s.waste_management + s.product_sourcing + s.carbon_footprint + s.community_engagement) / 5), 0) / stores.length).toFixed(1) : "0"} />
          <StatCard label="Eco Leaders" value={stores.filter(s => ((s.energy_efficiency + s.waste_management + s.product_sourcing + s.carbon_footprint + s.community_engagement) / 5) >= 4.5).length} />
        </motion.div>

        {/* Store Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-white/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No stores found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onClick={() => navigate(createPageUrl("StoreDetails") + `?id=${store.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-emerald-100 shadow-sm">
      <div className="text-2xl font-bold text-emerald-600 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}
