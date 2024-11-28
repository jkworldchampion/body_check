import { NextApiRequest, NextApiResponse } from "next";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "../../firestore/firebase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { imageUrl } = req.body;

    try {
        // Firestore에 Cloudinary URL 저장
        await addDoc(collection(firestore, "images"), { imageUrl });

        return res.status(200).json({ message: "이미지 URL 저장 성공" });
    } catch (error) {
        console.error("Firestore 저장 실패:", error);
        return res.status(500).json({ error: "Firestore 저장 실패" });
    }
}
