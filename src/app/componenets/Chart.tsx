'use client';

import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title,
    CategoryScale,
    LinearScale,
    BarElement,
} from 'chart.js';

import styles from './chart.module.css';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    Title,
    CategoryScale,
    LinearScale,
    BarElement
);

interface WorkoutSet {
    reps: string;
    weight?: string;
}

interface WorkoutData {
    workout_type: string;
    date: string;
    sets: WorkoutSet[];
}

interface ChartProps {
    workoutData: WorkoutData[];
}

const Chart: React.FC<ChartProps> = ({ workoutData }) => {
    const workoutTypes = ['benchpress', 'squat', 'running'];

    // 날짜별로 그룹화된 데이터 준비
    const dates = Array.from(new Set(workoutData.map((data) => data.date))).sort();

    const barChartData = {
        labels: dates,
        datasets: [
            {
                label: 'Reps',
                data: dates.map((date) => {
                    // 특정 날짜의 전체 reps 합산
                    return workoutData
                        .filter((data) => data.date === date)
                        .reduce(
                            (sum, data) =>
                                sum +
                                data.sets.reduce((setSum: number, set: WorkoutSet) => setSum + parseInt(set.reps, 10), 0),
                            0
                        );
                }),
                backgroundColor: '#4F46E5',
            },
            {
                label: 'Sets',
                data: dates.map((date) => {
                    // 특정 날짜의 전체 sets 수
                    return workoutData
                        .filter((data) => data.date === date)
                        .reduce((sum, data) => sum + data.sets.length, 0);
                }),
                backgroundColor: '#16A34A',
            },
            {
                label: 'Weights',
                data: dates.map((date) => {
                    // 특정 날짜의 전체 weight 합산
                    return workoutData
                        .filter((data) => data.date === date)
                        .reduce(
                            (sum, data) =>
                                sum +
                                data.sets.reduce((setSum: number, set: WorkoutSet) => setSum + parseInt(set.weight || '0', 10), 0),
                            0
                        );
                }),
                backgroundColor: '#EAB308',
            },
        ],
    };

    return (
        <div>
            {/* 운동별 원형 그래프 */}
            <div className={styles.chartContainer}>
                {workoutTypes.map((type, index) => {
                    const typeData = workoutData.filter((data) => data.workout_type === type);
                    const totalSets = typeData.reduce((sum, data) => sum + data.sets.length, 0);
                    const totalReps = typeData.reduce(
                        (sum, data) =>
                            sum +
                            data.sets.reduce((s: number, set: WorkoutSet) => s + parseInt(set.reps, 10), 0),
                        0
                    );
                    const totalWeight = typeData.reduce(
                        (sum, data) =>
                            sum +
                            data.sets.reduce((s: number, set: WorkoutSet) => s + parseInt(set.weight || '0', 10), 0),
                        0
                    );

                    const doughnutData = {
                        labels: ['완료된 세트', '남은 세트'],
                        datasets: [
                            {
                                label: `${type.toUpperCase()} Progress`,
                                data: [totalSets, Math.max(0, 10 - totalSets)], // 최대 10 세트 기준
                                backgroundColor: ['#CF2F11', '#757575'],
                            },
                        ],
                    };

                    return (
                        <div key={index} className={styles.chartCard}>
                            <h3 className={styles.chartTitle}>{type.toUpperCase()}</h3>
                            <div style={{ width: '200px', height: '200px', margin: '0 auto' }}>
                                <Doughnut data={doughnutData} />
                            </div>
                            <div style={{ marginTop: '30px', color: '#030303' }}>
                                <p>총 세트: {totalSets || '0'} 세트</p>
                                <p>총 반복: {totalReps || '0'} 회</p>
                                <p>총 무게: {totalWeight || '0'} kg</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 날짜별 막대 그래프 */}
            <div className={styles.barChartContainer}>
                <div className={styles.barChart}>
                    <div style={{width: '800px', height: '600px', marginTop: '100px'}}>

                        <Bar
                            data={barChartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false, // 고정 높이를 유지하기 위해 비율 유지 비활성화
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                },
                                scales: {
                                    x: {
                                        grid: {
                                            display: false,
                                        },

                                    },
                                    y: {
                                        beginAtZero: true,
                                    },
                                },
                            }}

                        />
                    </div>
                </div>
            </div>
        </div>
            );
            };

            export default Chart;
