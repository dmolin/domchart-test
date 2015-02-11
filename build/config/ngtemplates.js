module.exports = function ngtemplates(grunt) {
    return {
      ngtemplates: {
        mm: {
            cwd: 'src/app',
            src: '**/*.html',
            dest: '<%= workdir %>/templates.js'
        }
      }
    };
};
