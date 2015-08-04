var App = angular.module('starter', ['ionic', 'ionic.contrib.ui.cards']);
App.directive('noScroll', function ($document) {

    return {
        restrict: 'A',
        link: function ($scope, $element, $attr) {

            $document.on('touchmove', function (e) {
                e.preventDefault();
            });
        }
    }
});

App.factory('photosFactory', function ($http) {
    return{
        getPhotos : function(n,c) {
            return $http({
                url: 'http://ithoughs.azurewebsites.net/api/quote?applicationId=2&currentQuoteid='+c+'&quotetype=' + n,
                method: 'GET'
            })
        }
    }
});

App.controller('CardsCtrl', function ($scope, $ionicSwipeCardDelegate, photosFactory) {

    var counter = 0;
    $scope.id = 0;
    photosFactory.getPhotos(counter, $scope.id).success(function (data) {
        $scope.quote = data.QuoteDesc;
        $scope.author = (data.AuthorName != null ? data.AuthorName : 'James Witwiki');
        $scope.id = data.QuoteId;
        //console.log(data);
    });
   

    $scope.ShareQuote = function () {
        window.plugins.socialsharing.share($scope.quote);
    };


    $scope.next = function () {
        counter = 1;
        console.log($scope.id);
        photosFactory.getPhotos(counter, $scope.id).success(function (data) {
            $scope.quote = data.QuoteDesc;
            $scope.author = (data.AuthorName != null ? data.AuthorName : 'James Witwiki');
            $scope.id = data.QuoteId;
            //console.log(data);
        });
    };
    $scope.pre = function () {
        counter = -1;
        photosFactory.getPhotos(counter, $scope.id).success(function (data) {
            $scope.quote = data.QuoteDesc;
            $scope.author = (data.AuthorName != null ? data.AuthorName : 'James Witwiki');
            $scope.id = data.QuoteId;
            //console.log(data);
        });
    };

    var cardTypes = [{ title: 'Swipe down to get started', image: 'http://ionicframework.com.s3.amazonaws.com/demos/ionic-contrib-swipecards/pic.png' },
      { title: 'Where is this?', image: 'http://ionicframework.com.s3.amazonaws.com/demos/ionic-contrib-swipecards/pic.png' },
      { title: 'What kind of grass is this?', image: 'http://ionicframework.com.s3.amazonaws.com/demos/ionic-contrib-swipecards/pic2.png' },
      { title: 'What beach is this?', image: 'http://ionicframework.com.s3.amazonaws.com/demos/ionic-contrib-swipecards/pic3.png' },
      { title: 'What kind of clouds are these?', image: 'http://ionicframework.com.s3.amazonaws.com/demos/ionic-contrib-swipecards/pic4.png' }];

    $scope.cards = Array.prototype.slice.call(cardTypes, 0, 0);

    $scope.cardSwiped = function (index) {
        $scope.addCard();
        $scope.next();
    };

    $scope.cardDestroyed = function (index) {
        $scope.cards.splice(index, 1);
    };

    $scope.addCard = function () {
        var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
        newCard.id = Math.random();
        $scope.cards.push(angular.extend({}, newCard));
    }
});

App.controller('CardCtrl', function ($scope, $ionicSwipeCardDelegate) {
    $scope.goAway = function () {
        var card = $ionicSwipeCardDelegate.getSwipeableCard($scope);
        card.swipe();
    };
});