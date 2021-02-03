export default function formatLabel(str) {
  const letters = str
    .split('.')
    .slice(-1)[0]
    .split(/(?=[A-Z])/)
  const formattedLetters = letters.map((letter, i) => {
    if (i == 0) {
      return letter
        .split('')
        .map((c, i) => (i == 0 ? c.toUpperCase() : c))
        .join('')
    } else {
      return letter.toLowerCase()
    }
  })

  return formattedLetters.join(' ')
}
