function increaseNumberQueueContact(classname, wait) {
    let currentValue = +$(`.${classname}`).find('b').text()
	currentValue += 1
	
	if(currentValue === 0){
		wait ? $(`.${classname}`).html('') : $(`.${classname}`).css('display', 'none').html('')
	} else{
		wait ? $(`.${classname}`).html(`(<b>${currentValue}</b>)`) : $(`.${classname}`).css('display', 'block').text(currentValue)
	}
}

function decreaseNumberQueueContact(classname, wait) {
	let currentValue = +$(`.${classname}`).find('b').text()	
	currentValue >= 1 ? currentValue -= 1 : null

    if(currentValue === 0){
		wait ? $(`.${classname}`).html('') : $(`.${classname}`).css('display', 'none').html('')
	} else{
		wait ? $(`.${classname}`).html(`(<b>${currentValue}</b>)`) : $(`.${classname}`).css('display', 'block').text(currentValue)
	}
}
