//탈퇴 기능

"use client";

import { useRouter } from "next/navigation";

export default function DeleteAccount() {
    const router = useRouter();

    const handleDelete = () => {
        // 탈퇴 처리 로직
        alert("탈퇴되었습니다.");
        router.push("/Login");
    };

    return (
        <button onClick={handleDelete}>
            정말 탈퇴하시겠습니까?
        </button>
    );
}
