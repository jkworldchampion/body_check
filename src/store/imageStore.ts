//이미지 상태관리

import { create } from "zustand";

interface ImageState {
    uploadedImageUrl: string | null;
    setUploadedImageUrl: (url: string) => void;
}

const useImageStore = create<ImageState>((set) => ({
    uploadedImageUrl: null,
    setUploadedImageUrl: (url) => set({ uploadedImageUrl: url }),
}));

export default useImageStore;
