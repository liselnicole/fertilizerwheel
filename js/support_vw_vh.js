
/**@author Konrad Gadzinowski <kgadzinowski@gmail.com>
 * 
 */

    function SupportVhVw() {
        //console.log('called');

        this.setVh = function(name, vh, attr) {

            // $(window).resize( function(event) {
            //     scaleVh(name, vh, attr);
            // });

            scaleVh(name, vh, attr);
        }

        this.setVw = function(name, vw, attr) {

            // $(window).resize( function(event) {
            //     scaleVw(name, vw, atrr);
            // });

            scaleVw(name, vw, attr);
        }

        var scaleVw = function(name, vw, attr) {

            var scrWidth = jQuery(document).width();
            var px = (scrWidth * vw) / 100;
            var fontSize = jQuery(name).css(attr, px + "px");
        }


        var scaleVh = function(name, vh, attr) {

            var scrHeight = jQuery(document).height();
            console.log(scrHeight);

            var px = (scrHeight * vh) / 100;
            var fontSize = jQuery(name).css(attr, px + "px");
        }
    };
    

        //Adjust DIV heights
        // Init object
        function adjustHeightElements() {
            console.log('adjustHeightElements called'); 
            var supportVhVw = new SupportVhVw();

            supportVhVw.setVh("#one .img", 30, 'height');
            supportVhVw.setVh("#one .img img", 30, 'height');
            supportVhVw.setVh("#one #main", 70, 'height');
            supportVhVw.setVh(".button-grid span", 3, 'font-size');
            supportVhVw.setVh(".button-grid span", 3.2, 'line-height');
            supportVhVw.setVh(".button-grid img", 15, 'height');
            supportVhVw.setVh(".button-grid img", 1, 'margin-bottom');
        }
    


