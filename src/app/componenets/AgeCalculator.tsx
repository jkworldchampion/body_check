//연령대 계산
export const AgeCalculator = (age: number): string => {
    if (age < 20) return "10대 미만";
    if (age < 30) return "20대";
    if (age < 40) return "30대";
    if (age < 50) return "40대";
    if (age < 60) return "50대";
    if (age < 70) return "60대";
    return "70대 이상";
};
