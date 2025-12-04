function isDigit(c) {
    return c >= '0' && c <= '9'
}
function isAlpha(c) {
    return (c >= 'a' && c <= 'z' ||
        c >= 'A' && c <= 'Z' ||
        c === '_'
    )
}
function isAlphaNumeric(c) {
    return isAlpha(c) || isDigit(c)
}

module.exports = {
    isDigit,
    isAlpha,
    isAlphaNumeric
}