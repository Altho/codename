
export const bonus = (p: number):number => {
    return Math.floor( 0.5 * (Math.sqrt( 8 * p) +1))
}

export const levelBonus = (p: number):number => {
    return Math.ceil(bonus(p))
}

export const GroupBonus = (p: number):number => {
    return Math.ceil(bonus(p))
}


