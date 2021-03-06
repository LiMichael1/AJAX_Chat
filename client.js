var pollServer = function() {
    $.get('chat.php', function(result) {
        if(!result.success) {
            console.log("Error polling server for new messages!");
            return;
        }
        console.log('getting');
        //ask for a name and background color back
        $.each(result.messages, function(idx) {
            console.log(this.name, this.message, this.bg_color);
            console.log(this.id);
            var chatBubble;
            
            if(this.id == getName()) {
                chatBubble = $(`<div style="--bg-color:${this.bg_color}" class="row bubble-sent pull-right"> 
                                ${this.name} : ${this.message} 
                                </div><div class="clearfix"></div>`);
            } else {
                chatBubble = $(`<div style="--bg-color:${this.bg_color}" class="row bubble-recv"> 
                                ${this.name} : ${this.message} 
                                </div><div class="clearfix"></div>`);
            }
            
            $('#chatPanel').append(chatBubble);

        });
        
        setTimeout(pollServer, 5000);
    });
}

$(document).on('ready', function() {
    if(getName() === null) {
        $('.input-group').hide();
    } else {
        console.log('Name Id: ' + getName())
        $('.name-input').hide();
        $('.bubble-recv').hide();
    }

    //Start Polling when name has been entered 
    console.log('Polling the Server');
    pollServer();
    
    
    $('button').click(function() {
        $(this).toggleClass('active');
    });
});

$('#sendMessageBtn').on('click', function(event) {
    event.preventDefault();
    
    var message = $('#chatMessage').val();

    // send message and name id to server 
    $.post('chat.php', {
        'message' : message,
        'name_id': getName()
    }, function(result) {
        
        $('#sendMessageBtn').toggleClass('active');
    
        if(!result.success) {
            alert("There was an error sending your message");
        } else {
            console.log("Message sent: " + message);
            $('#chatMessage').val('');
        }
    });
    
});
