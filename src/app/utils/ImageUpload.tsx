interface CloudinaryUploadOptions {
    cloudName: string;
    uploadPreset: string;
    sources: string[];
}

export const uploadImageToCloudinary = (
    options: CloudinaryUploadOptions,
    onSuccess: (url: string) => void,
    onError?: (error: any) => void
) => {
    const widget = window.cloudinary.createUploadWidget(
        {
            cloudName: options.cloudName,
            uploadPreset: options.uploadPreset,
            sources: options.sources,
        },
        (error: any, result: any) => {
            if (error) {
                console.error("Cloudinary 업로드 오류:", error);
                if (onError) onError(error);
            }

            if (result && result.event === "success") {
                console.log("Cloudinary 업로드 성공:", result.info.secure_url);
                onSuccess(result.info.secure_url);
            }
        }
    );

    widget.open(); // 업로드 위젯 열기
};
