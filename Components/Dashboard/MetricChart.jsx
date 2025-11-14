import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function MetricChart({ data, title, description }) {
  return (
    <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-900">{title}</CardTitle>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#10b981' }}
            />
            <YAxis 
              domain={[0, 5]}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#10b981' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: '1px solid #10b981',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="system" fill="#10b981" name="System Rating" radius={[8, 8, 0, 0]} />
            <Bar dataKey="community" fill="#3b82f6" name="Community Average" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
