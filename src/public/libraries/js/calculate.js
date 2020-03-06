// if parameter type = false, then handle popup notify counter
// Otherwise handle modal notify counter

function increaseNumberQueueContact(classname, type, number = 1) {
	let currentValue = +$(`.${classname}`).find('b').text()
	currentValue += number

	type ? $(`.${classname}`).html(`(<b>${currentValue}</b>)`).removeClass('d-none') 	 : $(`.${classname}`).html(`<b>${currentValue}</b>`).removeClass('d-none').css('display', '')
}

function decreaseNumberQueueContact(classname, type, number = 1) {
	let currentValue = +$(`.${classname}`).find('b').text()
	currentValue > 0 ? currentValue -= number : null

    if(currentValue === 0){
		type ? $(`.${classname}`).html('') 
			 : $(`.${classname}`).html('').addClass('d-none')
	} else{
		type ? $(`.${classname}`).html(`(<b>${currentValue}</b>)`).removeClass('d-none') 
			 : $(`.${classname}`).html(`<b>${currentValue}</b>`).removeClass('d-none')
	}
}
