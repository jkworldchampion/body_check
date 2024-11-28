// src/types/cloudinary.d.ts
declare global {
    interface Window {
        cloudinary: {
            createUploadWidget: (
                options: CloudinaryWidgetOptions,
                callback: (error: any, result: any) => void
            ) => CloudinaryWidget;
        };
    }
}

interface CloudinaryWidget {
    open: () => void;
    close: () => void;
    destroy: () => void;
}

interface CloudinaryWidgetOptions {
    cloudName: string;
    uploadPreset: string;
    sources: string[];
    [key: string]: any;
}

export {};  // 모듈로 만들기 위한 빈 export
