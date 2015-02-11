module.exports = function index(grunt) {
    return {
        template: {
            options: {},
            dev: {
                options: {
                    data:{
                        scripts: [
                            '<script src="js/jquery.min.js"></script>',
                            '<script src="js/underscore-min.js"></script>',
                            '<script src="js/angular.min.js"></script>',
                            '<script src="js/angular-ui-router.min.js"></script>',
                            '<script src="js/app/bootstrap.js"></script>',
                            '<script src="js/app/templates.js"></script>',
                            //module: home
                            '<script src="js/app/home/index.js"></script>',
                            '<script src="js/app/home/HomeController.js"></script>',
                            //module: busviz
                            '<script src="js/app/busviz/index.js"></script>',
                            '<script src="js/app/busviz/directives/mmBusviz.js"></script>',
                            '<script src="js/app/busviz/services/BusinessService.js"></script>'
                        ].join('\n')
                    }
                },

                files: {
                    '<%= distdir %>/index.html': ['src/index.html.tpl']
                }
            },

            prod: {
                options:{
                    data:{
                        scripts: [
                            '<script src="js/app.js"></script>\n'
                        ].join('')
                    }
                },

                files: {
                    '<%= distdir %>/index.html': ['src/index.html.tpl']
                }
            }
        }
    };
};
