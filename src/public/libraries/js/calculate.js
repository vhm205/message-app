// if wait parameter = false, then handle popup notify counter
// Otherwise handle modal notify counter

function increaseNumberQueueContact(classname, wait, number = 1) {
    let currentValue = +$(`.${classname}`).find('b').text()
	currentValue += number
	
	if(currentValue === 0){
		wait ? $(`.${classname}`).html('') : $(`.${classname}`).css('display', 'none').html('')
	} else{
		wait ? $(`.${classname}`).html(`(<b>${currentValue}</b>)`) : $(`.${classname}`).css('display', 'block').html(`<b>${currentValue}</b>`)
	}
}

function decreaseNumberQueueContact(classname, wait, number = 1) {
	let currentValue = +$(`.${classname}`).find('b').text()	
	currentValue >= 1 ? currentValue -= number : null

    if(currentValue === 0){
		wait ? $(`.${classname}`).html('') : $(`.${classname}`).css('display', 'none').html('')
	} else{
		wait ? $(`.${classname}`).html(`(<b>${currentValue}</b>)`) : $(`.${classname}`).css('display', 'block').html(`<b>${currentValue}</b>`)
	}
}
