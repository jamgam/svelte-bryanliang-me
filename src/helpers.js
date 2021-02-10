export const randomInt = (min, max) => {
  return Math.floor(Math.random() * Math.floor(max - min)) + min
}

export const randomNum = (min, max) => {
  return (Math.random() * (max - min)) + min
}

export const isOutOfBounds = (width, height, x, y, offset) => {
  offset = offset || 0
  return !(x > -offset && y > -offset && y < height + offset && x < width + offset)
}