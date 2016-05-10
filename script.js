(function() {

  var myApp = angular.module("myApp", []);
  
  var MainController = function($scope, github, $interval, 
    $log, $anchorScroll, $location) {

    var onUserComplete = function(data) {
      $scope.user = data;
      github.getRepos($scope.user).then(onRepos, onError);
    }
    
    var onRepos = function(data) {
      $scope.repos = data;
      $location.hash('userDetails');
      $anchorScroll();
    }

    var decrementCount = function() {
        $scope.countdown -=1;
        if ($scope.countdown < 1) {
          $scope.search($scope.username);
        }
    }
    
    var countInterval = null;
    
    var startCount = function() {
      countInterval = $interval(decrementCount, 1000, $scope.countdown);
    }
    
    var onError = function() {
      $scope.error = "Could not load the data";
    }
    
    $scope.search = function(username) {
      $log.debug("Searching for " + username);
      github.getUser(username).then(onUserComplete, onError);
      if(countInterval) {
        $interval.cancel(countInterval);
        $scope.countdown = null;
      }
    }
    
    $scope.countdown = 5;
    $scope.username = "angular";
    $scope.message = "Hello, GitHub :)";
    $scope.repoSortOrder = "-stargazers_count";
    startCount();
  }
  
  myApp.controller('MainController', MainController);
  
})();