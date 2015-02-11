'use strict';

var app = angular.module('mm', ['ui.router','mm.home']);

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
        //Home state
        .state('home', {
            url: '/',
            templateUrl: 'home/home.html',
            controller: 'HomeController'
        });
});
