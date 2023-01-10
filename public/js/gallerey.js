function Clamp(value , min , max){
    return value > max? min : value < min? max : value
}

function gallerey(gl , urls){
    let index = urls.lenght> 3? 1: 0
    
    let max = urls.length-1
    let btns = gl.getElementsByClassName('gallerey_btn')
    let btnBack = btns[0]
    let btnNext = btns[1]

    let main = gl.getElementsByClassName('main_photo_gallerey')[0]
    let main_img = main.getElementsByTagName('img')[0]
    let left = gl.getElementsByClassName('left_photo_gallerey')[0]
    let left_img = left.getElementsByTagName('img')[0]
    let right = gl.getElementsByClassName('right_photo_gallerey')[0]
    let right_img = right.getElementsByTagName('img')[0]

    let full_watch = gl.getElementsByClassName('gall_fullscreen_button')[0]
    let full_frame = gl.getElementsByClassName('gall_frame')[0]
    let full_img = full_frame.getElementsByClassName('img_source')[0].getElementsByTagName('img')[0]

    main_img.setAttribute('src' , urls[index])
    left_img.setAttribute('src' , urls[Clamp(index-1 , 0 , max)])
    right_img.setAttribute('src' , urls[Clamp(index+1 , 0 , max)])

    btnBack.onclick = function(){
        index = Clamp(index-1 , 0 , max)
        main_img.setAttribute('src' , urls[index])
        left_img.setAttribute('src' , urls[Clamp(index-1 , 0 , max)])
        right_img.setAttribute('src' , urls[Clamp(index+1 , 0 , max)])
    }
    btnNext.onclick = function(){
        index = Clamp(index+1 , 0 , max)
        main_img.setAttribute('src' , urls[index])
        left_img.setAttribute('src' , urls[Clamp(index-1 , 0 , max)])
        right_img.setAttribute('src' , urls[Clamp(index+1 , 0 , max)])
    }

    left.onclick = function(){
        index = Clamp(index-1 , 0 , max)
        main_img.setAttribute('src' , urls[index])
        left_img.setAttribute('src' , urls[Clamp(index-1 , 0 , max)])
        right_img.setAttribute('src' , urls[Clamp(index+1 , 0 , max)])
    }
    right.onclick = function(){
        index = Clamp(index+1 , 0 , max)
        main_img.setAttribute('src' , urls[index])
        left_img.setAttribute('src' , urls[Clamp(index-1 , 0 , max)])
        right_img.setAttribute('src' , urls[Clamp(index+1 , 0 , max)])
    }


    full_watch.onclick = function(){
        full_frame.setAttribute('class' , 'frame gall_frame')
        full_img.setAttribute('src' , urls[index])
    }
}

