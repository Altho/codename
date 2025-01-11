
export const bonus = (p: number):number => {
    const threshold = 4;
    if (p < threshold) {
        return p;
    } else {
        return Math.ceil(Math.sqrt(4 * p))
    }
}

export const levelBonus = (p: number):number => {
    return Math.ceil(bonus(p))
}

export const groupBonus = (p: number):number => {
    return Math.ceil(bonus(p))
}


