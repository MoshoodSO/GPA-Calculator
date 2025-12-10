import { Semester } from "@/types/gp";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart } from "recharts";
import { TrendingUp } from "lucide-react";

interface GPTrendChartProps {
  semesters: Semester[];
}

export function GPTrendChart({ semesters }: GPTrendChartProps) {
  const data = semesters.map((sem, index) => {
    const allCourses = semesters.slice(0, index + 1).flatMap(s => s.courses);
    const cgpa = allCourses.length > 0
      ? allCourses.reduce((sum, c) => sum + c.creditHours * c.gradePoints, 0) /
        allCourses.reduce((sum, c) => sum + c.creditHours, 0)
      : 0;
    
    return {
      name: sem.name.replace("Semester ", "Sem "),
      gpa: parseFloat(sem.gpa.toFixed(2)),
      cgpa: parseFloat(cgpa.toFixed(2)),
    };
  });

  if (semesters.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle>GPA Trend</CardTitle>
              <CardDescription>Track your academic progress over time</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Add semesters to see your GPA trend
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <TrendingUp className="h-5 w-5 text-accent" />
          </div>
          <div>
            <CardTitle>GPA Trend</CardTitle>
            <CardDescription>Track your academic progress over time</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="cgpaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              domain={[0, 5]} 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="gpa"
              stroke="hsl(var(--primary))"
              fill="url(#gpaGradient)"
              strokeWidth={0}
            />
            <Line
              type="monotone"
              dataKey="gpa"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
              name="Semester GPA"
            />
            <Line
              type="monotone"
              dataKey="cgpa"
              stroke="hsl(var(--secondary))"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ fill: 'hsl(var(--secondary))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: 'hsl(var(--secondary))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
              name="Cumulative GPA"
            />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Semester GPA</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-secondary" />
            <span className="text-sm text-muted-foreground">Cumulative GPA</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
