function isNormalInteger(str) {
    return /^\+?(0|[1-9]\d*)$/.test(str);
}

export { isNormalInteger };