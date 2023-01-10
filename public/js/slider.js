const rangeInputs = document.querySelectorAll('input[type="range"]')
const numberInput = document.querySelector('input[type="number"]')

function handleInputChange(e) {
  let target = e.target
  if (e.target.type !== 'range') {
    target = document.getElementById('range')
  } 
  const min = target.min
  const max = target.max
  const val = target.value
  
  target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%'
}

rangeInputs.forEach(input => {
  input.addEventListener('input', handleInputChange)
  input.addEventListener('change', handleInputChange)
  // start
  let e = {}
  e.target = input
  console.log(e.target.type)
  handleInputChange(e)
})

if(numberInput)numberInput.addEventListener('input', handleInputChange)


function changeTextValueFromSlider(id , value){
    $('#'+id).html(value)
}