export const relativeDate = (iso: string): string => {
    const days = Math.round((new Date().getTime() - new Date(iso).getTime()) / 86400000)
    if (days === 0) return 'hoy'
    if (days === 1) return 'ayer'
    if (days < 7)   return `hace ${days}d`
    if (days < 30)  return `hace ${Math.floor(days / 7)}sem`
    if (days < 365) return `hace ${Math.floor(days / 30)}m`
    return `hace ${Math.floor(days / 365)}a`
}