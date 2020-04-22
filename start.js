if(getName() == '') {
    $('.input-group').hide();
} else {
    console.log(getName())
    $('.name-input').hide();
}


$('#start').on('click', function(event) {
    event.preventDefault();
    setName();

    $.post('chat.php', {
        'name': nickname,
        'bg_color': generateRandomColor()
    }, function(result) { //SENDS THE NAME ID BACK HERE 
        if(!result.success) {
            alert('It appears your nickname is taken');
            $('#nickname').val('');
        } else {
            $('.name-input').hide();
            $('.input-group').show();
        }
    });
});

//SET NAME ID INSTEAD
function setName() {
    // need Error checking to see if nickname is set
    let cookieValue = escape($('#nickname').val()) + ';';
    let cookieString = "name=" + cookieValue;
    let expire_date = new Date();
    expire_date.setMonth( expire_date.getMonth() +1);
    let expires = "expires=" + expire_date.toString() + ";";

    cookieString += expires;
    console.log(cookieString);
    document.cookie = cookieString;
}

function getName() {
    let cookieArray = document.cookie.split(';');
    for(let i=0; i< cookieArray.length; i++)
    {
        key = cookieArray[i].split('=')[0];
        if(key == 'name')
            return cookieArray[i].split('=')[1];
    }

    return '';
}

function generateRandomColor() {
    let randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    return randomColor;
}