"use client";

import React, { useEffect, useState } from "react";
import { firestore } from "@/app/firestore/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

interface WorkoutSession {
    date: string;
    sets: { reps: number; weight: string }[];
    user_id: string;
    user_name: string;
    workout_type: string;
}

interface Props {
    userId: string;
}

const UseWorkout: React.FC<Props> = ({ userId }) => {
    const [sessions, setSessions] = useState<WorkoutSession[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSessions = async () => {
        try {
            const sessionsRef = collection(firestore, "workout_sessions");
            const q = query(sessionsRef, where("user_id", "==", userId));
            const querySnapshot = await getDocs(q);

            const sessionsData: WorkoutSession[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                sessionsData.push({
                    date: data.date,
                    sets: data.sets,
                    user_id: data.user_id,
                    user_name: data.user_name,
                    workout_type: data.workout_type,

                });
            });

            setSessions(sessionsData);
        } catch (error) {
            console.error("Workout sessions 데이터를 가져오는 중 오류 발생:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchSessions();
        }
    }, [userId]);

    if (loading) return <p>로딩 중...</p>;

    if (sessions.length === 0) return <p>운동 기록이 없습니다.</p>;

    return (
        <div style={{ marginTop: "20px" }}>
            <h3>운동 기록</h3>
            {sessions.map((session, index) => (
                <div key={index} style={{ marginBottom: "20px",  padding: "10px" }}>
                    <h4>운동 날짜: {session.date}</h4>
                    <p>운동 종류: {session.workout_type}</p>
                    <p>사용자 이름: {session.user_name}</p>
                    <div style={{ marginTop: "10px" }}>
                        <h5>운동 정보:</h5>
                        <ul>
                            {session.sets.map((set, setIndex) => (
                                <li key={setIndex}>
                                    <strong>{setIndex + 1}세트</strong> - 갯수: {set.reps}개, 무게: {set.weight}kg
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UseWorkout;
