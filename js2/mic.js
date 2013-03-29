//load graphing script
//may be recalled after cleaning the container
function putGraph(){
    $.ajax({
        url:'/drawGraph',
        dataType:'script'
    });
}
function updateGraph(data){
    $.ajax({
        url:'/updateGraph',
        dataType:'script',
        success: function(data, status, xhr){
            console.log(data);
        }
    });
}
$(function(){
    //handlers for menu, forms, etc.
    $('#forms').hide();
    putGraph();
    $('#menu a[id!=home]').click(function(evt){
        evt.preventDefault();
        if($('#forms').is(':hidden') || !$('#forms').hasClass($(evt.currentTarget).attr('rel'))){
        $('#forms').slideUp(function(){
        $.ajax({
            url: $(evt.currentTarget).attr('href'),
            success: function(data, status, xhr){
                $('#forms').html(data);
                $('#forms').attr('class', $(evt.currentTarget).attr('rel'));
                $('#forms').css('left', $(evt.currentTarget).offset().left);
                $('#forms').slideDown();
                $('#forms form').submit(function(formEvt){
                    formEvt.preventDefault();
                    $.ajax({
                        url:$(formEvt.currentTarget).attr('action'),
                        type:$(formEvt.currentTarget).attr('method'),
                        data: $(formEvt.currentTarget).serialize(),
                        success: function(d, s, x){
                            //redraw graph
                            $('#forms').slideUp();
                            //$('#viewport').empty();
                            //putGraph();
                            redraw();
                        }
                    });
                });
            }
        });
        });
        }
        else {
            $('#forms').slideUp();
        }
    });
});
