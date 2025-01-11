export const getBonus = (p: number):number => {
    const threshold = 4;
    if (p < threshold) {
        return p;
    } else {
        return Math.ceil(Math.sqrt(4 * p))
    }
}