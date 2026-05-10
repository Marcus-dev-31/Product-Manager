export const formatARS = (n: number): string =>
    '$' + Number(n).toLocaleString('es-AR')