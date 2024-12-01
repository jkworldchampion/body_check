interface CloudinaryUploadOptions {
    cloudName: string;
    uploadPreset: string;
    sources: string[];
}

export const uploadImageToCloudinary = (
    options: CloudinaryUploadOptions,
    onSuccess: (url: string) => void,
    onError?: (error: any) => void
): Promise<void> => {
    return new Promise((resolve, reject) => {
        // Cloudinary 스크립트가 로드되었는지 확인
        if (!window.cloudinary) {
            const error = new Error('스크립트가 로드되지 않았습니다.');
            if (onError) onError(error);
            reject(error);
            return;
        }

        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: options.cloudName,
                uploadPreset: options.uploadPreset,
                sources: options.sources,
                multiple: false,
                maxFiles: 1,
            },
            (error: any, result: any) => {
                if (error) {
                    console.error("Cloudinary 업로드 오류:", error);
                    if (onError) onError(error);
                    reject(error);
                    return;
                }

                if (result && result.event === "success") {
                    const url = result.info.secure_url;
                    console.log("Cloudinary 업로드 성공:", url);
                    onSuccess(url);
                    resolve();
                }
            }
        );

        widget.open();
    });
};
