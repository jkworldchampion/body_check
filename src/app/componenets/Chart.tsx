'use client';

import React from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
} from 'chart.js';

import styles from './chart.module.css';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    Title,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement
);

interface ChartProps {
    workoutData: any[];
}

const Chart: React.FC<ChartProps> = ({ workoutData }) => {
    const workoutTypes = ['benchpress', 'squat', 'running'];

    const workoutCharts = workoutTypes.map((type) => {
        const typeData = workoutData.filter((data) => data.workout_type === type);

        const totalSets = typeData.reduce((sum, data) => sum + data.sets.length, 0);
        const totalReps = typeData.reduce(
            (sum, data) => sum + data.sets.reduce((s: number, set: any) => s + parseInt(set.reps, 10), 0),
            0
        );
        const totalWeight = typeData.reduce(
            (sum, data) =>
                sum +
                data.sets.reduce((s: number, set: any) => s + parseInt(set.weight || 0, 10), 0),
            0
        );

        return {
            type,
            totalSets,
            totalReps,
            totalWeight,
        };
    });

    const lineChartData = (field: 'reps' | 'sets' | 'weight') => {
        const labels = workoutData.length > 0 ? workoutData.map((data) => data.date) : ['2024-01-01'];
        const datasets = [
            {
                label: field === 'reps' ? 'Reps' : field === 'sets' ? 'Sets' : 'Weights',
                data: workoutData.length
                    ? workoutData.map((data) =>
                        data.sets.reduce((sum: number, set: any) => sum + parseInt(set[field] || 0, 10), 0)
                    )
                    : [0],
                borderColor: field === 'reps' ? '#4F46E5' : field === 'sets' ? '#16A34A' : '#EAB308',
                backgroundColor: field === 'reps' ? '#4F46E550' : field === 'sets' ? '#16A34A50' : '#EAB30850',
                tension: 0.4,
                fill: true,
            },
        ];

        return {
            labels,
            datasets,
        };
    };

    return (
        <div>
            {/* 운동별 원형 그래프 */}
            <div className={styles.chartContainer}>
                {workoutCharts.map((chart, index) => {
                    const data = {
                        labels: ['완료된 세트', '남은 세트'],
                        datasets: [
                            {
                                label: `${chart.type} Progress`,
                                data: [chart.totalSets || 0, 10 - (chart.totalSets || 0)], // 최대 10세트 기준
                                backgroundColor: ['#4F46E5', '#E5E7EB'],
                                borderWidth: 1,
                            },
                        ],
                    };

                    return (
                        <div key={index} className={styles.chartCard}>
                            <h3 className={styles.chartTitle}>{chart.type.toUpperCase()}</h3>
                            <Doughnut data={data} />
                            <div>
                                <p>총 세트: {chart.totalSets || '0'} 세트</p>
                                <p>총 반복: {chart.totalReps || '0'} 회</p>
                                <p>총 무게: {chart.totalWeight || '0'} kg</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 꺾은선 그래프 */}
            <div className={styles.lineChartContainer}>
                <div className={styles.lineChart}>
                    <Line data={lineChartData('reps')} />
                </div>
                <div className={styles.lineChart}>
                    <Line data={lineChartData('sets')} />
                </div>
                <div className={styles.lineChart}>
                    <Line data={lineChartData('weight')} />
                </div>
            </div>
        </div>
    );
};

export default Chart;
