var exec = require('child_process').exec;

module.exports = function concat(grunt) {
    return {
        connect: {
            server: {
                options: {
                    port: 8000,
                    hostname: "*",
                    base: "dist",
                    livereload: true
                }
            }
        }
    };
};
