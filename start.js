var startPoll = false;
//Start Button
$('#start').on('click', function(event) {
    event.preventDefault();

    var nickname = $('#nickname').val();

    $.post('chat.php', {
        'name': nickname,
        'bg_color': generateRandomColor()
    }, function(result) { //SENDS THE NAME ID BACK HERE 
        if(!result.success) {
            alert('It appears your nickname is taken');
            $('#nickname').val('');
        } else {
            console.log('Name Id: ' + result.name_id);
            setName(result.name_id);
            $('.name-input').hide();
            $('.input-group').show();
            $('.bubble-recv').show();
        }
    });
});

//SET NAME ID INSTEAD
function setName(name_id) {
    // need Error checking to see if nickname is set
    sessionStorage.setItem('name_id', name_id);
}

//GET NAME ID 
function getName() {
    return sessionStorage.getItem('name_id');
}

//GENERATE RANDOM COLOR 
function generateRandomColor() {
    let randomColor = '';
    while(randomColor.length != 7) {
        randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    }
    return randomColor;
}