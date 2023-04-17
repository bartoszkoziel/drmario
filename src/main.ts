import "./style.css"

interface Square {
   x: number
   y: number
   color: string
   state: string
}

interface Pill {
   squares: [{ x: number; y: number; color: string }, { x: number; y: number; color: string }]
   axis: string
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

   constructor() {
      this.main = document.getElementById("main") as HTMLElement

      document.onkeydown = (e) => {
         if (e.key == "ArrowRight") {
            // CHECKING IF MOVE IS POSSIBLE
            if ((this.pill.squares[0].x + 1 < this.width && this.pill.squares[1].x + 1 < this.width) &&
               this.currTab[this.getIndexOf(this.pill.squares[0].x + 1, this.pill.squares[0].y)].color == "white" &&
               this.currTab[this.getIndexOf(this.pill.squares[1].x + 1, this.pill.squares[1].y)].color == "white"
            ) {
               this.pill.squares[0].x += 1
               this.pill.squares[1].x += 1
               this.printer()
            } else {
               console.log("OUT OF BOUNDS")
            }
         }

         else if (e.key == "ArrowLeft") {
            // CHECKING IF MOVE IS POSSIBLE
            if ((this.pill.squares[0].x - 1 >= 0 && this.pill.squares[1].x - 1 >= 0) &&
               this.currTab[this.getIndexOf(this.pill.squares[0].x - 1, this.pill.squares[0].y)].color == "white" &&
               this.currTab[this.getIndexOf(this.pill.squares[1].x - 1, this.pill.squares[1].y)].color == "white"
            ) {
               this.pill.squares[0].x -= 1
               this.pill.squares[1].x -= 1
               this.printer()
            } else {
               console.log("OUT OF BOUNDS")
            }
         }

         else if (e.key == "z") {
            if (this.pill.axis == "right") { this.pill.axis = "down"; this.rotate("down") }
            else if (this.pill.axis == "down") { this.pill.axis = "left"; this.rotate("left") }
            else if (this.pill.axis == "left") { this.pill.axis = "up"; this.rotate("up") }
            else if (this.pill.axis == "up") { this.pill.axis = "right"; this.rotate("right") }
         }
         console.log(e.key)
      }

      this.createBoard()
      this.createPill(this.startX, this.startY)

      this.printer()
   }

   printer() {
      for (let i = 0; i < this.currTab.length; i++) {
         let block = document.getElementById(this.currTab[i].x + "_" + this.currTab[i].y) as HTMLElement
         block.style.backgroundColor = this.currTab[i].color
      }
      for (let i = 0; i < 2; i++) {
         let block = document.getElementById(this.pill.squares[i].x + "_" + this.pill.squares[i].y) as HTMLElement
         block.style.backgroundColor = this.pill.squares[i].color
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
               state: "none"
            })
            console.log("eququq")
         }
      }
   }

   createPill(x: number, y: number) {
      let rColor1 = this.numberToColor(Math.floor(Math.random() * 3))
      let rColor2 = this.numberToColor(Math.floor(Math.random() * 3))

      this.pill = {
         squares: [
            { x: x, y: y, color: rColor1 },
            { x: x + 1, y: y, color: rColor2 }
         ],
         axis: "right"
      }

      this.pillInterval = setInterval(() => {
         console.log("INTERVAL RUNNING...")

         if (this.isBelowFree()) {
            this.pill.squares[0].y += 1
            this.pill.squares[1].y += 1
            this.printer()
         } else {
            let index0 = this.getIndexOf(this.pill.squares[0].x, this.pill.squares[0].y)
            let index1 = this.getIndexOf(this.pill.squares[1].x, this.pill.squares[1].y)

            console.log("INDEX0", index0)

            this.currTab[index0].color = this.pill.squares[0].color
            this.currTab[index1].color = this.pill.squares[1].color

            clearInterval(this.pillInterval!)
            setTimeout(() => {
               this.createPill(this.startX, this.startY)
               this.printer()
            }, 1000)
         }
      }, 5000)
   }

   rotate(dir: string) {
      if (dir == "down") {
         let index = this.getIndexOf(this.pill.squares[0].x, this.pill.squares[0].y + 1)
         if (this.currTab[index].color == "white") {
            this.pill.squares[1].x = this.currTab[index].x
            this.pill.squares[1].y = this.currTab[index].y
            this.printer()
         }
      } else if (dir == "left") {
         let index = this.getIndexOf(this.pill.squares[0].x - 1, this.pill.squares[0].y)
         if (this.currTab[index].color == "white") {
            this.pill.squares[1].x = this.currTab[index].x
            this.pill.squares[1].y = this.currTab[index].y
            this.printer()
         }
      } else if (dir == "up") {
         let index = this.getIndexOf(this.pill.squares[0].x, this.pill.squares[0].y - 1)
         if (this.currTab[index].color == "white") {
            this.pill.squares[1].x = this.currTab[index].x
            this.pill.squares[1].y = this.currTab[index].y
            this.printer()
         }
      } else if (dir == "right") {
         let index = this.getIndexOf(this.pill.squares[0].x + 1, this.pill.squares[0].y)
         if (this.currTab[index].color == "white") {
            this.pill.squares[1].x = this.currTab[index].x
            this.pill.squares[1].y = this.currTab[index].y
            this.printer()
         }
      }
   }

   isBelowFree() {
      // PROBLEM HERE!
      // Checking axis and if the pill is at the bottom
      if (this.pill.axis == "right" && this.pill.squares[0].y + 1 < this.height) {
         // Checking if the colors of the blocks below are white
         if (
            this.currTab[this.getIndexOf(this.pill.squares[0].x, this.pill.squares[0].y + 1)].color == "white" &&
            this.currTab[this.getIndexOf(this.pill.squares[1].x, this.pill.squares[1].y + 1)].color == "white"
         ) {
            console.log("ISBELOWFREE : TRUE")
            return true
         }
      }



      console.log("ISBELOWFREE : FALSE")
      return false
   }

   getIndexOf(x: number, y: number) {
      console.log(y * this.width + x)

      return y * this.width + x
   }

   numberToColor(num: number): string {
      if (num == 0) return "red"
      if (num == 1) return "blue"
      if (num == 2) return "yellow"

      console.log("OUT OF BOUNDS (this.numberToColor)")
      return "outOfBounds"
   }
}

const game = new Game()
console.log(game.currTab)
