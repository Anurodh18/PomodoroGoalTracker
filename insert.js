
    /// OPEN LOCALHOST 8000 ->  python -m SimpleHTTPServer 8000

    // Refer to the JavaScript quickstart on how to setup the environment:
    // https://developers.google.com/google-apps/calendar/quickstart/js
    // Change the scope to 'https://www.googleapis.com/auth/calendar' and delete any
    // stored credentials.
    var api_key = 'AIzaSyAoWtOIWVlv_is89lxaZQ6tOnDU6FCgLwA';
    var client_id = '849494497247-slssqa3ggb5ts1irs9o092qt5dgotrd1.apps.googleusercontent.com';
    var discovery_docs = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
    var scopes = "https://www.googleapis.com/auth/calendar";
    var authorizeButton = document.getElementById('authorize-button');
    var signoutButton = document.getElementById('signout-button');

    // var submit = document.getElementsByName("event_submit");

    // POST https://www.googleapis.com/calendar/v3/calendars/calendarId/events
    // use calendar.events.insert
    // inside the post request
    //   -- recurrence 'RRULE:FREQ=DAILY;INTERVAL=number'
    //   -- reminder.useDefault : false;
    //   -- reminder.overrides ( "method" : "popup")
    //   -- start.dateTime+05:30
    //   -- end.dateTime+05:30
    //   -- colorId : "11"
    //   -- summary : "🍅 title" && "✔️ 🍅 title" when updated
    //   -- system generated description

    /**
     *  On load, called to load the auth2 library and API client library.
     */
    function handleClientLoad() {
      gapi.load('client:auth2', initClient);
    }

    /**
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
    function initClient() {
      gapi.client.init({
        apiKey: api_key,
        clientId: client_id,
        discoveryDocs: discovery_docs,
        scope: scopes
      }).then(function() {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
      });
    }

    /**
     *  Called when the signed in status changes, to update the UI
     *  appropriately. After a sign-in, the API is called.
     */
    function updateSigninStatus(isSignedIn) {
      if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        document.getElementById("add_event").style.display = 'block';
        user.innerHTML = "<h4>" + gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail().slice(0, -10) + "</h4>";
        listUpcomingEvents();
        // firebase data list //
        listData();
      } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        document.getElementById("name").innerHTML = "";
      }
    }

    /**
     *  Sign in the user upon button click.
     */
    function handleAuthClick(event) {
      gapi.auth2.getAuthInstance().signIn();
    }

    /**
     *  Sign out the user upon button click.
     */
    function handleSignoutClick(event) {
      gapi.auth2.getAuthInstance().signOut();
      window.location.reload();
    }

    function addEvent(){
      if(document.getElementById("input_data").style.display == 'none'){
        document.getElementById("input_data").style.display = 'block';
        document.getElementById("event_submit").style.display = 'block';
        var name = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName();
        document.getElementById("name").innerHTML = "Commit a goal " +  "<b>" + name + "</b>";
        document.getElementById("add_event").innerHTML = '!';
      } else {
        document.getElementById("input_data").style.display = 'none';
        document.getElementById("event_submit").style.display = 'none';
        document.getElementById("name").innerHTML = "";
        document.getElementById("add_event").innerHTML = '+';
      }
     }

  function insertEvent(){
    if(document.getElementsByName("event_summary")[0].value){
      document.getElementById("input_data").style.display = 'none';
      document.getElementById("event_submit").style.display = 'none';
      document.getElementById("add_event").style.display = 'block';
      document.getElementById("name").innerHTML = '';
      // storing input values in variables to be passed.
      var eventName = ":pomo: " + document.getElementsByName("event_summary")[0].value;
      var value_day = document.getElementsByName("event_date")[0].value;
      var value_month = document.getElementsByName("event_date")[1].value;
      var value_year = document.getElementsByName("event_date")[2].value;
      var value_hour = document.getElementsByName("event_time")[0].value;
      var value_min = document.getElementsByName("event_time")[1].value;
      var dateTime = value_year + "-" + value_month + "-" + value_day + "T" + value_hour + ":" + value_min + ":00+05:30";
      var eventInterval = document.getElementsByName("event_interval")[0].value;
      var description = document.getElementById("timer_len").value + "' pomo" + document.getElementById("break_len").value + "' break";
      var endDate_day = document.getElementsByName("event_end")[0].value;
      var endDate_month = document.getElementsByName("event_end")[1].value;
      var endDate_year = document.getElementsByName("event_end")[2].value;
      var until = "" + endDate_year + endDate_month + endDate_day;

      var event = {
        'summary': eventName,
        'description': description,
        'start': {
          'dateTime': dateTime,
          'timeZone': 'Asia/Calcutta'
        },
        'end': {
          'dateTime': dateTime,
          'timeZone': 'Asia/Calcutta'
        },
        'colorId': '11',
        'recurrence': [
          'RRULE:FREQ=DAILY;UNTIL='+ until +';INTERVAL=' + eventInterval
        ],
        'reminders': {
          'useDefault': false,
          'overrides': [{
            'method': 'popup',
            'minutes': 10
          }]
        }
      };
      console.log(event);
      var request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event
      });



      request.execute(function(event) {
        console.log(event);
        window.location.reload();
      });
          console.log(event);

        upload();
        function upload(){
          var data = {
            "pomoDuration": document.getElementById("timer_len").value,
            "breakDuration": document.getElementById("break_len").value,
            "target": document.getElementById("target").value,
            "total": 0
          }
          var username = encode(gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail().slice(0, -10));
          var userRef = database.ref(username);
          var goalRef = userRef.child(eventName.slice(6));
          goalRef.set(data);
      }


    }else{ alert("fill in goal name !");}
  }

  //  to encode uid according to firebase terms.
  function encode(str){
    str = str.replace(/\./g, '-');
    str = str.replace(/\$/g, '&');
    str = str.replace(/#/g, '@');
    str = str.replace(/\[/g, '(');
    str = str.replace(/\]/g, ')');
    str = str.replace(/\//g, "_");
    return str;
  }
