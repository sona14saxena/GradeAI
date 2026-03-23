"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function DashboardPage() {
    const [data, setData] = useState<any>(null);
    const [summary, setSummary] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        const fetchDashboardData = async () => {
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
            try {
                const modelAnswerId = localStorage.getItem("current_model_answer_id");
                if (!modelAnswerId) {
                    setError("No model answer uploaded yet. Please upload files first.");
                    return;
                }

                // Fetch Class Summary
                const sumRes = await fetch(`${API_BASE_URL}/analytics/class-summary/${modelAnswerId}`);
                if (!sumRes.ok) throw new Error("Failed to fetch class summary");
                const sumData = await sumRes.json();

                if (sumData.message) {
                    setError(sumData.message);
                    return;
                }

                setSummary(sumData);

                // Fetch Question Difficulty
                const diffRes = await fetch(`${API_BASE_URL}/analytics/question-difficulty/${modelAnswerId}`);
                if (!diffRes.ok) throw new Error("Failed to fetch question difficulty");
                const diffData = await diffRes.json();

                if (diffData.question_analysis) {
                    const labels = diffData.question_analysis.map((q: any) => `Question ${q.question_id}`);
                    const scores = diffData.question_analysis.map((q: any) => q.average_score_percentage);

                    setData({
                        labels: labels,
                        datasets: [
                            {
                                label: 'Average Score (%)',
                                data: scores,
                                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                            },
                        ],
                    });
                }

            } catch (err: any) {
                console.error(err);
                setError(err.message || "An error occurred fetching dashboard data.");
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-background p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="glass p-6 rounded-xl shadow-sm border border-border/50">
                        <h2 className="text-muted-foreground text-sm font-semibold uppercase tracking-wider mb-2">Class Average</h2>
                        <p className="text-4xl font-bold text-primary">{summary?.average_score ? `${summary.average_score}%` : '-'}</p>
                    </div>
                    <div className="glass p-6 rounded-xl shadow-sm border border-border/50">
                        <h2 className="text-muted-foreground text-sm font-semibold uppercase tracking-wider mb-2">Highest Score</h2>
                        <p className="text-4xl font-bold text-green-500">{summary?.highest_score ?? '-'}</p>
                    </div>
                    <div className="glass p-6 rounded-xl shadow-sm border border-border/50">
                        <h2 className="text-muted-foreground text-sm font-semibold uppercase tracking-wider mb-2">Lowest Score</h2>
                        <p className="text-4xl font-bold text-red-500">{summary?.lowest_score ?? '-'}</p>
                    </div>
                    <div className="glass p-6 rounded-xl shadow-sm border border-border/50">
                        <h2 className="text-muted-foreground text-sm font-semibold uppercase tracking-wider mb-2">Evaluated</h2>
                        <p className="text-4xl font-bold text-foreground">{summary?.total_students ?? 0}</p>
                    </div>
                </div>

                <div className="glass p-8 rounded-xl shadow-sm border border-border/50">
                    <h2 className="text-xl font-bold mb-4 text-foreground">Question Difficulty Analysis</h2>
                    {error ? (
                        <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
                            <p>{error}</p>
                        </div>
                    ) : (
                        <div className="h-80 w-full flex items-center justify-center bg-secondary/20 rounded-lg p-4">
                            {data ? (
                                <Bar
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { position: 'top' as const },
                                            title: { display: false },
                                        },
                                        scales: {
                                            y: {
                                                grid: { color: 'rgba(150, 150, 150, 0.1)' }
                                            },
                                            x: {
                                                grid: { color: 'rgba(150, 150, 150, 0.1)' }
                                            }
                                        }
                                    }}
                                    data={data}
                                />
                            ) : (
                                <p className="text-muted-foreground">Synchronizing Analytics Engine...</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
