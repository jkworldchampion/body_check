// bmi category 계산함..

export const bmiCategories = {
    여성: {
        "20대": {
            저체중: [0, 18.5],
            정상: [18.5, 22.9],
            과체중: [23, 24.9],
            비만: [25, 29.9],
            고도비만: [30, Infinity],
        },
        "30대": {
            저체중: [0, 18.5],
            정상: [18.5, 22.9],
            과체중: [23, 24.9],
            비만: [25, 29.9],
            고도비만: [30, Infinity],
        },
    },
    남성: {
        "20대": {
            저체중: [0, 18.5],
            정상: [18.5, 22.9],
            과체중: [23, 24.9],
            비만: [25, 29.9],
            고도비만: [30, Infinity],
        },
        "30대": {
            저체중: [0, 18.5],
            정상: [18.5, 22.9],
            과체중: [23, 24.9],
            비만: [25, 29.9],
            고도비만: [30, Infinity],
        },
    },
};

export const getBMICategory = (
    gender: "남성" | "여성",
    ageGroup: string,
    bmi: number
): string | null => {
    // @ts-ignore
    const categories = bmiCategories[gender]?.[ageGroup];
    if (!categories) return null;

    for (const [category, range] of Object.entries(categories)) {
        // @ts-ignore
        if (bmi >= range[0] && bmi < range[1]) {
            return category;
        }
    }
    return null;
};
