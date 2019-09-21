$(document).ready(function() {
  var firebaseConfig = {
    apiKey: 'AIzaSyCVv6gxYLpc_ijHha335KtJep6Wp2huLoo',
    authDomain: 'project-1-12648.firebaseapp.com',
    databaseURL: 'https://project-1-12648.firebaseio.com',
    projectId: 'project-1-12648',
    storageBucket: 'project-1-12648.appspot.com',
    messagingSenderId: '383251596238',
    appId: '1:383251596238:web:629905b1e87f3d66eee19f'
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();

  var addName = '';
  var destination = '';
  var traintime = '';
  var frequency = 3;

  $('#add-train').on('click', function(event) {
    event.preventDefault();

    // Grabbed values from text boxes
    addName = $('#addName').val();

    traintime = $('#traintime').val();

    destination = $('#destination').val();

    frequency = $('#frequency').val();

    // Code for handling the push
    database.ref().push({
      addName: addName,
      destination: destination,
      traintime: traintime,
      frequency: frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  });

  // Firebase watcher .on("child_added"
  database.ref().on(
    'child_added',
    function(childSnapshot) {
      // storing the snapshot.val() in a variable for convenience
      var sv = childSnapshot.val();

      // console.log('fb' + snapshot.val().addName);
      // Console.loging the last user's data
      // console.log(sv.traintime);
      // console.log(sv.destination);
      // console.log(sv.frequency);
      // console.log(sv.addName);
      // Handle the errors
      var firstTrain = '03:30';
      // Chang year so first train comes before now
      var firstTrainNew = moment(
        childSnapshot.val().firstTrain,
        'hh:mm'
      ).subtract(1, 'years');
      // Difference between the current and firstTrain
      var diffTime = moment().diff(moment(firstTrainNew), 'minutes');
      var remainder = diffTime % childSnapshot.val().frequency;
      // Minutes until next train
      var minAway = childSnapshot.val().frequency - remainder;
      // Next train time
      var nextTrain = moment().add(minAway, 'minutes');
      nextTrain = moment(nextTrain).format('LT');
      // var dt = new Date();
      // var time = dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();
      // console.log(time);
      var row = $('<tr>');
      // var col = $('<td>');
      row.append(
        $('<td>').text(sv.addName),
        $('<td>').text(sv.destination),
        $('<td>').text(sv.frequency),
        $('<td>').text(nextTrain),
        $('<td>').text(minAway)
      );
      $('tbody').append(row);
    },
    function(error) {
      console.log('Errors handled: ' + errorObject.code);
    }
  );
  // var nextTrain = moment().add(tMinutesTillTrain, 'minutes');
  // console.log('ARRIVAL TIME: ' + moment(nextTrain).format('hh:mm'));
});
