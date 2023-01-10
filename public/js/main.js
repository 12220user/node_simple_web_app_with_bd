let header_maxed = false;
$(window).scroll(function(){
    let scrollDelta = $(window).scrollTop();
    let maxed = header_maxed?'maxed':'min'
    $('header').attr('class' , (scrollDelta > 80?'header-fixed ':' ') + maxed)
})

$('#header-more').click(function(){
    $('header').toggleClass('maxed' , 'min')
    header_maxed = !header_maxed;
})

$('#nav_about_project').click(function(){
    $('#about_frame').toggleClass('hide' , '')  
})

function CloseFrameEvent(frameId){
    $(frameId).toggleClass('hide' , '')
    console.log(1)
}


$('.img_block').each(function(i , obj){
    let attr = obj.getAttribute('url')
    let block = obj.getElementsByClassName('img_block_image')
    if(attr!= null )
    {
        //console.log(block)
        block[0].style.backgroundImage = 'url(\''+attr+'\')'
    }
})