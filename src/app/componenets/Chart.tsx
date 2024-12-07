'use client';

import React from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
} from 'chart.js';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
);

interface WorkoutSet {
    reps: number;
    weight: string;
}

interface WorkoutSession {
    workout_type: string;
    sets: WorkoutSet[];
    date: string; // ISO string
}

interface ChartProps {
    workoutData: WorkoutSession[];
    targetReps: { [key: string]: number };
    onUpdateTargetReps: (workoutType: string, newTarget: number) => void;
}

const Chart: React.FC<ChartProps> = ({ workoutData, targetReps, onUpdateTargetReps }) => {
    // Aggregate workout reps by date
    const dateAggregatedData = workoutData.reduce((acc, session) => {
        const date = new Date(session.date).toLocaleDateString('ko-KR'); // Format date
        const reps = session.sets.reduce((sum, set) => sum + set.reps, 0);

        if (acc[date]) {
            acc[date] += reps; // Add reps for the same date
        } else {
            acc[date] = reps; // Initialize reps for a new date
        }

        return acc;
    }, {} as { [date: string]: number });

    // Line chart data configuration
    const lineChartData = {
        labels: Object.keys(dateAggregatedData), // X-axis labels (dates)
        datasets: [
            {
                label: '날짜별 총 반복 횟수',
                data: Object.values(dateAggregatedData), // Y-axis values (total reps)
                borderColor: '#4F46E5',
                backgroundColor: '#4F46E5',
                tension: 0.1,
                fill: false,
            },
        ],
    };

    return (
        <div className="space-y-8">
            {['벤치프레스', '스쿼트', '데드리프트'].map((workoutType) => {
                const session = workoutData.find((data) => data.workout_type === workoutType);
                const totalReps = session
                    ? session.sets.reduce((sum, set) => sum + set.reps, 0)
                    : 0;
                const target = targetReps[workoutType] || 10;

                // 원형 차트
                const doughnutData = {
                    labels: ['완료된 반복', '남은 반복'],
                    datasets: [
                        {
                            data: [totalReps, Math.max(0, target - totalReps)],
                            backgroundColor: ['#4F46E5', '#E5E7EB'],
                            borderWidth: 0,
                        },
                    ],
                };

                return (
                    <div key={workoutType} className="bg-white p-2 rounded-lg shadow">
                        <h3 className="text-lg font-bold mb-2 text-gray-700">{workoutType.toUpperCase()}</h3>
                        <div className="flex items-center justify-between">
                            {/* 원형 */}
                            <div className="relative w-36 ml-20 h-40">
                                <Doughnut
                                    data={doughnutData}
                                    options={{
                                        cutout: '75%',
                                        plugins: {
                                            tooltip: { enabled: true },
                                            legend: { display: false },
                                        },
                                    }}
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <p className="text-lg font-bold text-gray-700">{totalReps}</p>
                                    <p className="text-sm text-gray-500">/ {target}</p>
                                </div>
                            </div>

                            {/*목표치 설정 */}
                            <div className="flex mr-10 items-center">
                                <input
                                    type="number"
                                    className="w-14 p-1 border rounded"
                                    value={target}
                                    onChange={(e) => onUpdateTargetReps(workoutType, parseInt(e.target.value, 10))}
                                />
                                <button
                                    className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    onClick={() => onUpdateTargetReps(workoutType, target)}
                                >
                                    저장
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Line chart */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold mb-4 text-gray-700">날짜별 운동 기록</h3>
                <div className="w-full h-[400px]">
                    <Line
                        data={lineChartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { position: 'top' },
                            },
                            scales: {
                                x: { grid: { display: false } },
                                y: {
                                    beginAtZero: true,
                                    max: 150, // Maximum Y-axis value
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Chart;
