module.exports = function(grunt) {
    return {
        watch: {
            karma: {
                files: [
                    "src/**/*.js",
                    "src/**/*.html",
                    "static/**/*.css",
                    "static/**/*.png",
                    "static/**/*.jpg",
                    "build/**/*"
                ],
                tasks: ["dev", "karma"],
                options: { livereload: true }
            }
        }
    };
}
