// 타입을 정해보장

interface Cloudinary {
    createUploadWidget: (
        options: any,
        callback: (error: any, result: any) => void
    ) => { open: () => void };
}

interface Window {
    cloudinary: Cloudinary;
}

declare namespace NodeJS {
    interface ProcessEnv {
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: string;
        NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: string;
    }
}
