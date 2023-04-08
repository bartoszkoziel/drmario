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
}

class Game {
   width: number
   height: number
   main: HTMLElement

   pill!: Pill

   currTab: Square[] = []

   constructor() {
      this.width = 8
      this.height = 16
      this.main = document.getElementById("main") as HTMLElement
      this.createBoard()
   }

   // TUTAJ SKONCZYLES (ZROB PRINTERA DOBREGO)
   printer() {
      for (let i = 0; i < this.currTab.length; i++) {}
   }

   createBoard() {
      for (let y = 0; y < this.height; y++) {
         for (let x = 0; x < this.width; x++) {
            let block = document.createElement("div")
            block.className = "block"
            block.id = x + "_" + y

            this.main.append(block)
            this.currTab.push({ x: x, y: y, color: "none", state: "none" })
            console.log("eququq")
         }
      }
   }

   createPill(x: number, y: number) {
      this.pill = {
         squares: [
            { x: x, y: y, color: "red" },
            { x: x + 1, y: y, color: "red" },
         ],
      }
   }
}

const game = new Game()
console.log(game.currTab)
