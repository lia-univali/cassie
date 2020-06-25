function toEnglish(){
    alert('working on translation');
    $('body').removeClass('pt');
    $('body').addClass('en');
}   

function toPortuguese(){
    $('body').removeClass('en');
    $('body').addClass('pt');
}