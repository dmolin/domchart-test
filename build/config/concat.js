var fs = require('fs');

module.exports = function concat(grunt) {
    return {
        concat: {
            options: {
                separator: ";\n"
            },
            prod: {
                src: [
                    '<%= srcdir %>/js/jquery.min.js',
                    '<%= srcdir %>/js/underscore-min.js',
                    '<%= srcdir %>/js/angular.min.js',
                    '<%= srcdir %>/js/angular*.js',
                    '<%= srcdir %>/app/bootstrap.js',
                    '<%= srcdir %>/app/**/index.js',
                    '<%= srcdir %>/app/**/*.js',
                    '!<%= srcdir %>/app/**/*Spec.js',
                    '<%= workdir %>/templates.js'
                ],
                dest: '<%= workdir %>/app.js'
            }
        }
    };
};
