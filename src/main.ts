import "./style.css"

interface Square {
   x: number
   y: number
   color: string
   state: string
}

interface Pill {
   squares: [
      { x: number; y: number; color: string },
      { x: number; y: number; color: string }
   ]
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
            if (
               this.pill.squares[0].x + 1 < this.width &&
               this.pill.squares[1].x + 1 < this.width
            ) {
               this.pill.squares[0].x += 1
               this.pill.squares[1].x += 1
               this.printer()
            } else {
               console.log("OUT OF BOUNDS")
            }
         }

         if (e.key == "ArrowLeft") {
            // CHECKING IF MOVE IS POSSIBLE
            if (
               this.pill.squares[0].x - 1 >= 0 &&
               this.pill.squares[1].x - 1 >= 0
            ) {
               this.pill.squares[0].x -= 1
               this.pill.squares[1].x -= 1
               this.printer()
            } else {
               console.log("OUT OF BOUNDS")
            }
         }
         console.log(e.key)
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
            this.pill.squares[i].x + "_" + this.pill.squares[i].y
         ) as HTMLElement
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
            this.currTab.push({ x: x, y: y, color: "white", state: "none" })
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
            { x: x + 1, y: y, color: rColor2 },
         ],
         axis: "right",
      }
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
