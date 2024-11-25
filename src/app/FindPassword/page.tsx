'use client';
import { useState } from "react";
import { getPasswordByIdAndName } from "../firestore/firestore";

const FindPassword = () => {
    const [name, setName] = useState("");
    const [id, setId] = useState("");
    const [password, setPassword] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handlePasswordRecovery = async (e: React.FormEvent) => {
        e.preventDefault();
        setPassword(null);
        setError(null);

        try {
            const retrievedPassword = await getPasswordByIdAndName(id, name);
            if (!retrievedPassword) {
                setError("ID와 이름이 일치하는 사용자가 없습니다.");
                return;
            }
            setPassword(retrievedPassword);
        } catch (err) {
            setError("비밀번호를 찾는 도중 오류가 발생했습니다.");
            console.error(err);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
            <h1>비밀번호 찾기</h1>
            <form onSubmit={handlePasswordRecovery}>
                <div>
                    <input
                        type="text"
                        placeholder="이름"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="아이디"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        style={{ width: "100%", padding: "8px", marginBottom: "20px" }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: "#4285F4",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    비밀번호 찾기
                </button>
            </form>
            {password && <p>비밀번호: {password}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default FindPassword;
