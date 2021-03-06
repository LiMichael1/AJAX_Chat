<?php
session_start();
ob_start();
header("Content-type: application/json");
date_default_timezone_set('UTC');
//connect to database
$db = mysqli_connect('localhost', 'root', '', 'ajax_chat');
if (mysqli_connect_errno()) {
   echo '<p>Error: Could not connect to database.<br/>
   Please try again later.</p>';
   exit;
}
//helper funtion to replace get_results() if without mysqlnd 
function get_result( $Statement ) {
    $RESULT = array();
    $Statement->store_result();
    for ( $i = 0; $i < $Statement->num_rows; $i++ ) {
        $Metadata = $Statement->result_metadata();
        $PARAMS = array();
        while ( $Field = $Metadata->fetch_field() ) {
            $PARAMS[] = &$RESULT[ $i ][ $Field->name ];
        }
        call_user_func_array( array( $Statement, 'bind_result' ), $PARAMS );
        $Statement->fetch();
    }
    return $RESULT;
}
try { 
    $currentTime = time();
    $session_id = session_id();    
    $lastPoll = isset($_SESSION['last_poll']) ? $_SESSION['last_poll'] : $currentTime;    
    $action = isset($_SERVER['REQUEST_METHOD']) && ($_SERVER['REQUEST_METHOD'] == 'POST') ? 'send' : 'poll';
    switch($action) {
        case 'poll':
            //GET NAME and BACKGROUND COLOR FROM NAMETABLE
            $query = 'SELECT nametable.name, chatlog.message, nametable.bg_color, nametable.id
                      FROM chatlog
                      JOIN nametable
                      ON chatlog.name_id = nametable.id
                      WHERE date_created >='.$lastPoll;
            $stmt = $db->prepare($query);
            $stmt->execute();
            $stmt->bind_result($name, $message, $bg_color, $name_id);
            $result = get_result( $stmt);
            $newChats = [];
            while($chat = array_shift($result)) {
                $newChats[] = $chat;
            }
            $_SESSION['last_poll'] = $currentTime;

            //SEND NAME ID AND BACKGROUND COLOR BACK
            print json_encode([
                    'success' => true,
                    'messages' => $newChats
            ]);
            exit;
        case 'send':
            if (isset($_POST['bg_color']))  //pressed START button?
            {
                //insert into the table
                $bg_color = strip_tags($_POST['bg_color']);
                $name = strip_tags($_POST['name']);
                $query = "INSERT INTO nametable (name, bg_color) VALUES(?, ?)";
                $stmt = $db->prepare($query);
                $stmt->bind_param('ss', $name, $bg_color);
                $stmt->execute(); 
                $stmt->close();

                //GET NAME_ID
                $query = "SELECT id FROM nametable WHERE name = '$name'";
                $stmt = $db->prepare($query);
                $stmt->execute();
                $stmt->bind_result($id);
                while($stmt->fetch())
                {
                    $name_id = $id;
                }
                
                //SEND NAME_ID AND SUCCESS BACK
                print json_encode(['success' => true, 
                                   'name_id' => $name_id]);
                exit;
            }
            else {  //send message
                $name_id = isset($_POST['name_id']) ? $_POST['name_id'] : '';
                $message = isset($_POST['message']) ? $_POST['message'] : '';            
                $message = strip_tags($message);
                $query = "INSERT INTO chatlog (name_id, message, sent_by, date_created) VALUES(?, ?, ?, ?)";
                $stmt = $db->prepare($query);
                $stmt->bind_param('issi', $name_id, $message, $session_id, $currentTime); 
                $stmt->execute(); 
                print json_encode(['success' => true]);
                exit;
            }
    }
} catch(Exception $e) {
    print json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
