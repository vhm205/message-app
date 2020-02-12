function increaseNumberQueueContact(classname) {
    let currentValue = +$(`.${classname}`).find('b').text()
    currentValue += 1

    if(currentValue === 0){
        $(`.${classname}`).html('')
    } else{
        $(`.${classname}`).html(`(<b>${currentValue}</b>)`)
    }
}

function decreaseNumberQueueContact(classname) {
    let currentValue = +$(`.${classname}`).find('b').text()
    currentValue -= 1

    if(currentValue === 0){
        $(`.${classname}`).html('')
    } else{
        $(`.${classname}`).html(`(<b>${currentValue}</b>)`)
    }
}
