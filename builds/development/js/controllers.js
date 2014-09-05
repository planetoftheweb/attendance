var appControllers = angular.module('appControllers', ['ngAnimate', 'firebase']);

// Register a User --------------------------------------------------------
appControllers.controller('RegisterController', 
['$scope', '$firebase', '$location', 'appInfo',
function($scope, $firebase, $location, appInfo) {

  //user submits registration form
  $scope.register = function() {
    var myDate = new Date().getTime();

    //create user through appInfo factory object
    appInfo.loginObj.$createUser($scope.email, $scope.password)
    .then(function(user) { //if user is successfully created
      appInfo.users.$push({ //push info to database
        id: user.id,
        date: myDate,
        firstname: $scope.firstname,
        lastname: $scope.lastname,
        email: user.email
      }).then(function() {
      }); //push to database
    }, function(error) {
      $scope.errorMessage = error.message;
    }); //user Creation

  } //User is Registered

}]); // RegisterController


// Login --------------------------------------------------------
appControllers.controller('LogInController', ['$scope', 'appInfo', '$location', function($scope, appInfo, $location) {

    $scope.login = function() { //clicked login button
      appInfo.loginObj.$login("password", {
        email: $scope.email,
        password: $scope.password
      }).then(function(user) {
        $location.path('/meetings');
      }, function(error) {
       $scope.loginMessage = error.message;
     });      
    } //clicked login button

    $scope.logout = function() { //clicked logout
      appInfo.loginObj.$logout().then(function(user) {
      }, function(error) {
       $scope.loginMessage = error.message;
     });      
    } //clicked login button


}]); // Login


// Meetings Checkins
appControllers.controller('MeetingsController',
  ['$scope', 'appInfo', function($scope, appInfo) {

    console.log(appInfo.loginObj);


    if (appInfo.loginObj.user.email) {
      console.log("loggedin");
    } else {
      console.log("not loggedin");
      //$location.path('/login');
    }
  //$scope.users = $firebase(ref).$asArray();
}]); //MeetingsController

// Check Users Into Event
appControllers.controller('CheckInController', ['$scope', '$firebase', '$location', function($scope, $firebase, $location) {
    var ref = new Firebase("https://attendance100.firebaseio.com/");
    $scope.submitForm = function() { 
      var postsRef = ref;
      var loginDate = new Date().getTime();
      postsRef.push({
        firstname: $scope.firstname,
        date: loginDate,
        lastname: $scope.lastname,
        email: $scope.email,
      }); //postsRef
      $location.path('/list');
    }; //submitForm
}]); //CheckInController

// List Checkins
appControllers.controller('ListController', ['$scope', 'appInfo', function($scope, appInfo) {
  console.log(appInfo);
  //$scope.users = $firebase(ref).$asArray();
}]); //ListController

// Edit Checkins
appControllers.controller('EditController', ['$scope', '$firebase', '$routeParams', function($scope, $firebase, $routeParams) {
  var ref = new Firebase("https://attendance100.firebaseio.com/" + $routeParams.itemId);
  var sync = $firebase(ref);
  $scope.user = sync.$asObject();
  $scope.user.$bindTo($scope, "user");
}]); //EditController