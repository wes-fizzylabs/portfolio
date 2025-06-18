export const isCollided = ({ rect1, rect2 }) => {
  return (
    (rect1.position.x + 40) >= rect2.position.x &&
    rect1.position.x <= (rect2.position.x + 48) &&
    rect1.position.y <= rect2.position.y + 50 &&
    (rect1.position.y) + 40 >= rect2.position.y
  )
}