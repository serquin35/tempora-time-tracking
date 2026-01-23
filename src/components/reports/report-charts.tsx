import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReportEntry } from "@/hooks/use-reports-data"

interface ReportChartsProps {
    data: ReportEntry[]
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export function ReportCharts({ data }: ReportChartsProps) {
    // Project distribution
    const projectData = data.reduce((acc: any[], entry) => {
        const existing = acc.find(i => i.name === entry.project_name);
        const hours = entry.total_hours || 0;
        if (existing) {
            existing.value += hours;
        } else {
            acc.push({
                name: entry.project_name,
                value: hours,
                color: entry.project_color || COLORS[acc.length % COLORS.length]
            });
        }
        return acc;
    }, []).map(i => ({ ...i, value: Number(i.value.toFixed(2)) }));

    // User distribution
    const userData = data.reduce((acc: any[], entry) => {
        const existing = acc.find(i => i.name === entry.user_name);
        const hours = entry.total_hours || 0;
        if (existing) {
            existing.value += hours;
        } else {
            acc.push({ name: entry.user_name, value: hours });
        }
        return acc;
    }, []).map(i => ({ ...i, value: Number(i.value.toFixed(2)) }));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card shadow-sm">
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Horas por Proyecto</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                        <PieChart>
                            <Pie
                                data={projectData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {projectData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--popover))",
                                    borderColor: "hsl(var(--border))",
                                    borderRadius: "8px",
                                    color: "hsl(var(--popover-foreground))",
                                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                                }}
                                itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="bg-card shadow-sm">
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Horas por Usuario</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                        <BarChart data={userData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                            <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={100} />
                            <Tooltip
                                cursor={{ fill: "hsl(var(--muted)/0.2)" }}
                                contentStyle={{
                                    backgroundColor: "hsl(var(--popover))",
                                    borderColor: "hsl(var(--border))",
                                    borderRadius: "8px",
                                    color: "hsl(var(--popover-foreground))",
                                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                                }}
                                itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                            />
                            <Bar dataKey="value" fill="#84cc16" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
