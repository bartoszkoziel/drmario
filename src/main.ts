import "./style.css"

interface Square {
   x: number
   y: number
   color: string
   state: string
}

interface Pill {
   sqr: [
      { x: number; y: number; color: string },
      { x: number; y: number; color: string }
   ]
   axis: string
}

interface Scope {
   x: number
   y: number
}

class Game {
   main: HTMLElement
   pill!: Pill
   currTab: Square[] = []
   pillInterval: number | null = null

   width: number = 8
   height: number = 16
   startX: number = 3
   startY: number = 0
   virusNum: number = 3

   constructor() {
      this.main = document.getElementById("main") as HTMLElement

      document.onkeydown = (e) => {
         if (e.key == "ArrowRight") {
            // CHECKING IF MOVE IS POSSIBLE
            if (
               this.pill.sqr[0].x + 1 < this.width &&
               this.pill.sqr[1].x + 1 < this.width &&
               this.currTab[
                  this.getIndexOf(this.pill.sqr[0].x + 1, this.pill.sqr[0].y)
               ].color == "white" &&
               this.currTab[
                  this.getIndexOf(this.pill.sqr[1].x + 1, this.pill.sqr[1].y)
               ].color == "white"
            ) {
               this.pill.sqr[0].x += 1
               this.pill.sqr[1].x += 1
               this.printer()
            } else {
               console.log("OUT OF BOUNDS")
            }
         } else if (e.key == "ArrowLeft") {
            // CHECKING IF MOVE IS POSSIBLE
            if (
               this.pill.sqr[0].x - 1 >= 0 &&
               this.pill.sqr[1].x - 1 >= 0 &&
               this.currTab[
                  this.getIndexOf(this.pill.sqr[0].x - 1, this.pill.sqr[0].y)
               ].color == "white" &&
               this.currTab[
                  this.getIndexOf(this.pill.sqr[1].x - 1, this.pill.sqr[1].y)
               ].color == "white"
            ) {
               this.pill.sqr[0].x -= 1
               this.pill.sqr[1].x -= 1
               this.printer()
            } else {
               console.log("OUT OF BOUNDS")
            }
         } else if (e.key == "z") {
            if (this.pill.axis == "right") {
               if (this.rotate("down")) this.pill.axis = "down"
            } else if (this.pill.axis == "down") {
               if (this.rotate("left")) this.pill.axis = "left"
            } else if (this.pill.axis == "left") {
               if (this.rotate("up")) this.pill.axis = "up"
            } else if (this.pill.axis == "up") {
               if (this.rotate("right")) this.pill.axis = "right"
            }
         } else if (e.key == "ArrowDown") {
            if (this.isBelowFree()) {
               this.pill.sqr[0].y += 1
               this.pill.sqr[1].y += 1
               this.printer()
            }
         }
      }

      this.createBoard()
      this.createPill(this.startX, this.startY)

      this.printer()
   }

   printer() {
      for (let i = 0; i < this.currTab.length; i++) {
         let block = document.getElementById(
            this.currTab[i].x + "_" + this.currTab[i].y
         ) as HTMLElement
         block.style.backgroundColor = this.currTab[i].color
      }
      for (let i = 0; i < 2; i++) {
         let block = document.getElementById(
            this.pill.sqr[i].x + "_" + this.pill.sqr[i].y
         ) as HTMLElement
         block.style.backgroundColor = this.pill.sqr[i].color
      }
   }

   createBoard() {
      for (let y = 0; y < this.height; y++) {
         for (let x = 0; x < this.width; x++) {
            let block = document.createElement("div")
            block.className = "block"
            block.id = x + "_" + y

            this.main.append(block)
            this.currTab.push({
               x: x,
               y: y,
               color: "white",
               state: "none",
            })
         }
      }

      let tempCount = 0

      while (tempCount < 3) {
         let x = Math.floor(Math.random() * this.width)
         let y = Math.floor(Math.random() * (this.height - 4)) + 4
         let color = this.numberToColor(Math.floor(Math.random() * 3))

         if (this.currTab[this.getIndexOf(x, y)].color == "white") {
            this.currTab[this.getIndexOf(x, y)].color = color
            tempCount++
         }
      }
   }

   createPill(x: number, y: number) {
      let rColor1 = this.numberToColor(Math.floor(Math.random() * 3))
      let rColor2 = this.numberToColor(Math.floor(Math.random() * 3))

      this.pill = {
         sqr: [
            { x: x, y: y, color: rColor1 },
            { x: x + 1, y: y, color: rColor2 },
         ],
         axis: "right",
      }

      this.pillInterval = setInterval(() => {
         if (this.isBelowFree()) {
            this.pill.sqr[0].y += 1
            this.pill.sqr[1].y += 1
            this.printer()
         }
         // upadek bloczka
         else {
            let index0 = this.getIndexOf(this.pill.sqr[0].x, this.pill.sqr[0].y)
            let index1 = this.getIndexOf(this.pill.sqr[1].x, this.pill.sqr[1].y)

            console.log("INDEX0", index0)

            this.currTab[index0].color = this.pill.sqr[0].color
            this.currTab[index1].color = this.pill.sqr[1].color

            clearInterval(this.pillInterval!)
            setTimeout(() => {
               this.createPill(this.startX, this.startY)
               this.deleteLines()
               this.printer()
            }, 100)
         }
      }, 500)
   }

   rotate(dir: string) {
      if (dir == "down") {
         let index = this.getIndexOf(this.pill.sqr[0].x, this.pill.sqr[0].y + 1)
         if (this.currTab[index].color == "white") {
            this.pill.sqr[1].x = this.currTab[index].x
            this.pill.sqr[1].y = this.currTab[index].y
            this.printer()
            return true
         }
      } else if (dir == "left") {
         let index = this.getIndexOf(this.pill.sqr[0].x - 1, this.pill.sqr[0].y)
         if (this.currTab[index].color == "white" && this.pill.sqr[0].x != 0) {
            this.pill.sqr[1].x = this.currTab[index].x
            this.pill.sqr[1].y = this.currTab[index].y
            this.printer()
            return true
         }
      } else if (dir == "up") {
         let index = this.getIndexOf(this.pill.sqr[0].x, this.pill.sqr[0].y - 1)
         if (this.currTab[index].color == "white") {
            this.pill.sqr[1].x = this.currTab[index].x
            this.pill.sqr[1].y = this.currTab[index].y
            this.printer()
            return true
         }
      } else if (dir == "right") {
         let index = this.getIndexOf(this.pill.sqr[0].x + 1, this.pill.sqr[0].y)
         if (
            this.currTab[index].color == "white" &&
            this.pill.sqr[0].x != this.width - 1
         ) {
            this.pill.sqr[1].x = this.currTab[index].x
            this.pill.sqr[1].y = this.currTab[index].y
            this.printer()
            return true
         }
      }
      return false
   }

   isBelowFree() {
      // Checking axis and if the pill is at the bottom
      if (
         this.pill.sqr[0].y + 1 < this.height &&
         this.pill.sqr[1].y + 1 < this.height
      ) {
         // Checking if the colors of the blocks below are white
         let x1 = this.pill.sqr[0].x
         let y1 = this.pill.sqr[0].y

         let x2 = this.pill.sqr[1].x
         let y2 = this.pill.sqr[1].y

         if (
            (this.pill.axis == "right" &&
               this.currTab[this.getIndexOf(x1, y1 + 1)].color == "white" &&
               this.currTab[this.getIndexOf(x2, y2 + 1)].color == "white") ||
            (this.pill.axis == "down" &&
               this.currTab[this.getIndexOf(x2, y2 + 1)].color == "white") ||
            (this.pill.axis == "left" &&
               this.currTab[this.getIndexOf(x1, y1 + 1)].color == "white" &&
               this.currTab[this.getIndexOf(x2, y2 + 1)].color == "white") ||
            (this.pill.axis == "up" &&
               this.currTab[this.getIndexOf(x1, y1 + 1)].color == "white")
         ) {
            return true
         }
      }
      return false
   }

   getIndexOf(x: number, y: number) {
      return y * this.width + x
   }

   numberToColor(num: number): string {
      if (num == 0) return "red"
      if (num == 1) return "blue"
      if (num == 2) return "yellow"

      console.log("OUT OF BOUNDS (this.numberToColor)")
      return "outOfBounds"
   }

   deleteLines() {
      let marked = [] as Scope[]

      // horizontal lines
      for (let y = 0; y < this.height; y++) {
         let prevColor, currColor: string
         let count = 1

         for (let x = 1; x < this.width; x++) {
            prevColor = this.currTab[this.getIndexOf(x - 1, y)].color
            currColor = this.currTab[this.getIndexOf(x, y)].color

            if (prevColor == currColor && currColor != "white") count++
            else if (prevColor != currColor) {
               if (count > 3) {
                  for (let i = 0; i < count; i++) {
                     marked.push({ x: x - count + i, y: y })
                  }
               }
               count = 1
            }

            if (x == this.width - 1) {
               if (count > 3) {
                  for (let i = 0; i < count; i++) {
                     marked.push({ x: x - count + 1 + i, y: y })
                  }
               }
               count = 1
            }
         }
      }

      // vertical lines
      for (let x = 0; x < this.width; x++) {
         let prevColor, currColor: string
         let count = 1

         for (let y = 1; y < this.height; y++) {
            prevColor = this.currTab[this.getIndexOf(x, y - 1)].color
            currColor = this.currTab[this.getIndexOf(x, y)].color

            if (prevColor == currColor && currColor != "white") count++
            else if (prevColor != currColor) {
               if (count > 3) {
                  for (let i = 0; i < count; i++) {
                     marked.push({ x: x, y: y - count + i })
                  }
               }
               count = 1
            }
            if (y == this.height - 1) {
               if (count > 3) {
                  for (let i = 0; i < count; i++) {
                     marked.push({ x: x, y: y - count + i + 1 })
                  }
               }
               count = 1
            }
         }
      }

      if (marked.length != 0) {
         marked.forEach((item) => {
            this.currTab[this.getIndexOf(item.x, item.y)].color = "white"
         })
      }
   }
}

const game = new Game()
console.log(game.currTab)
