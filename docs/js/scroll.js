var navOffsetTop
$(document).ready(function() {
    navOffsetTop = $('nav').offset().top
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
    $(window).on('scroll', onScroll)
})
function onScroll() {
    if($(window).scrollTop() > 80){
        $('nav').addClass('bg-dark')
        $('nav').removeClass('bg-transparent')
    }
    if($(window).scrollTop() <= 80 ){
        $('nav').addClass('bg-transparent')
        $('nav').removeClass('bg-dark')
    }
}