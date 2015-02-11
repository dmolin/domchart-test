module.exports = function concat(grunt) {
    return {
        cssmin: {
            combine: {
                files: {
                    '<%= distdir %>/stylesheets/main.css': [
                        '<%= assetsdir %>/static/stylesheets/style.css',
                        '<%= assetsdir %>/static/stylesheets/_*.css'
                    ]
                }
            }

        }
    };
};
