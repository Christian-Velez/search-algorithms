let randomizeArray = document.getElementById('randomize-array')
let searchBtn = document.getElementById('search-btn')
let barsContainer = document.getElementById('bars-container')
let sleepInput = document.getElementById('sleep-input')
let numberInput = document.getElementById('number-input')
let methodSelect = document.getElementById('method')
let result = document.getElementById('result')

let searching = false

let minRange = 1
let maxRange = 100
let numOfBars = 40
let heightFactor = 5.5
let unsortedArray = new Array(numOfBars)
let sleepBetweenSwaps = 100

const baseColor = '#BEE3F8'
const accentColor = '#63B3ED'
const foundColor = '#48BB78'

function getDefaultSleep(method) {
   if(method === 'binary')
      return 1000
   
   return 600
}

function createRandomArray() {
   for (let i = 0; i < numOfBars; i++) {
      unsortedArray[i] = randomNum(minRange, maxRange)
   }
}

document.addEventListener('DOMContentLoaded', () => {
   createRandomArray()
   renderBars(unsortedArray)
})

function renderBars(array) {
   for (let i = 0; i < array.length; i++) {
      let bar = document.createElement('div')
      let text = document.createElement('p')
      text.innerHTML = array[i]

      bar.classList.add('bar')
      bar.style.height = array[i] * heightFactor + 'px'
      bar.appendChild(text)

      barsContainer.appendChild(bar)
   }
}

function setBarColor(index, color = baseColor) {
   const bars = document.getElementsByClassName('bar')
   bars[index].style.backgroundColor = color
}

function resetBarsColor() {
   const bars = document.getElementsByClassName('bar')

   for (let k = 0; k < bars.length; k++) {
      bars[k].style.backgroundColor = baseColor
   }
}

async function bubbleSort(array) {
   const bars = document.getElementsByClassName('bar')

   let i = 0
   let j = array.length - 1
   let atLeasOneSwaped

   do {
      atLeasOneSwaped = false
      i = 0

      while (i < j) {
         resetBarsColor()

         if (array[i] > array[i + 1]) {
            // Swap
            atLeasOneSwaped = true
            let temp = array[i + 1]
            array[i + 1] = array[i]
            array[i] = temp

            // Update with swaped height
            bars[i].style.height = array[i] * heightFactor + 'px'
            bars[i + 1].style.height = array[i + 1] * heightFactor + 'px'

            // Update numbers
            bars[i].children[0].innerHTML = array[i]
            bars[i + 1].children[0].innerHTML = array[i + 1]
         }

         i++
      }

      j--
   } while (atLeasOneSwaped)

   return array
}

function sortAndUpdateBars() {
   bubbleSort(unsortedArray)
   resetBarsColor()
}




async function linearSearch(item, array) {
   const bars = document.getElementsByClassName('bar')
   const lastPos = array.length - 1
   let i = 0

   while(i <= lastPos) {
      await sleep(sleepBetweenSwaps)
      resetBarsColor()
      
      bars[i].style.backgroundColor = accentColor

      if(array[i] === item) {
         await sleep(sleepBetweenSwaps)
         bars[i].style.backgroundColor = foundColor
         return i
      }
      
      i++
   }

   return -1
}


async function binarySearch(item, array) {
   const bars = document.getElementsByClassName('bar')
   const errorColor = '#F56565'
   const limitsColor = '#A0AEC0'
   
   let i = 0
   let j = array.length - 1

   while(i <= j) {
      resetBarsColor()
      const middle = Math.round((i + j) / 2)

      bars[i].style.backgroundColor = limitsColor
      bars[j].style.backgroundColor = limitsColor

      await sleep(sleepBetweenSwaps)
      bars[middle].style.backgroundColor = accentColor
      await sleep(sleepBetweenSwaps)


      if(array[middle] === item) {
         bars[middle].style.backgroundColor = foundColor
         return middle
      } else {
         bars[middle].style.backgroundColor = errorColor
         await sleep(sleepBetweenSwaps)
      }

      if(array[middle] > item) {
         j = middle - 1
      } else {
         i = middle + 1
      }
   }

   return -1
}



methodSelect?.addEventListener('change', (e) => {
   if(e.target.value === 'binary') {
      sortAndUpdateBars()
   }

   result.innerHTML = '&nbsp;'
})

randomizeArray.addEventListener('click', () => {
   const currentMethod = methodSelect.value
   
   if (searching) {
      return
   }

   createRandomArray()

   if(currentMethod === 'binary') {
      sortAndUpdateBars()
   } else {
      barsContainer.replaceChildren([])
      renderBars(unsortedArray)
   }
})



searchBtn.addEventListener('click', async () => {
   const method = methodSelect.value || 'linear'
   const item = numberInput.value
   const bars = [...document.getElementsByClassName('bar')]
   sleepBetweenSwaps = sleepInput.value || getDefaultSleep(method)

   bars.forEach(bar => {
      const timeMS = sleepBetweenSwaps / 2
      bar.style.transition = `background-color ${timeMS}ms ease-in-out`
   })

   if(!item || searching) return
   
   searching = true
   result.innerHTML = 'Searching...'

   switch (method) {
      case 'linear': {
         const pos = await linearSearch(Number(item), unsortedArray)

         if(pos === -1) {
            result.innerHTML = `Item ${item} not found`
         } else {
            result.innerHTML = `Item ${item} found at position ${pos}`
         }
         break
      }

      case 'binary': {
         const pos = await binarySearch(Number(item), unsortedArray)

         if(pos === -1) {
            result.innerHTML = `Item ${item} not found`
         } else {
            result.innerHTML = `Item ${item} found at position ${pos}`
         }
         break
      }

      default:
         break
   }

   searching = false
})
