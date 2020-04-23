if(getName() === null) {
    $('.input-group').hide();
} else {
    console.log(getName())
    $('.name-input').hide();
}


$('#start').on('click', function(event) {
    event.preventDefault();

    var nickname = $('#nickname').val();
    console.log(nickname);

    $.post('chat.php', {
        'name': nickname,
        'bg_color': generateRandomColor()
    }, function(result) { //SENDS THE NAME ID BACK HERE 
        if(!result.success) {
            alert('It appears your nickname is taken');
            $('#nickname').val('');
        } else {
            setName(result.name_id);
            $('.name-input').hide();
            $('.input-group').show();
        }
    });
});

//SET NAME ID INSTEAD
function setName(name_id) {
    // need Error checking to see if nickname is set
    sessionStorage.setItem('name_id', name_id);
}

function getName() {
    return sessionStorage.getItem('name_id');
}

function generateRandomColor() {
    let randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    return randomColor;
}