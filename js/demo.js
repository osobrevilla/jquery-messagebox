$(function() {
    
    var box;

    function next() {
        $(this).attr("disabled", "disabled").parent().next('li').find('button').removeAttr("disabled");
    }

    function option() {

        switch (this.id) {
            case 'create':
                box = new MessageBox(
                    'This is the title',
                    'And this is the content description example.'
                );
                box.el.appendTo("article");
                next.call(this); // ignore this line
                break;

            case 'close':
                box.close();
                next.call(this); // ignore this line
                break;

            case 'open':
                box.open();
                next.call(this); // ignore this line
                break;

            case 'close-delay':
                var that = this;
                box.close(3, function() {
                    alert("closed!");
                    next.call(that); // ignore this line
                });
                break;

            case 'open-with-blink':
                box.open().blink(2);
                next.call(this); // ignore this line
                break;


            case 'set-message':
                box.message(
                    'The new message title',
                    'And this is the new message text.'
                );
                next.call(this); // ignore this line
                break;


            case 'set-question':
                box.question(
                    'Antention!',
                    'Do you want to save the changes before quit?', {
                        'Accept': function() {
                            box.message(
                                'Success',
                                'the changes were saved successfully.'
                            );
                        },
                        'Cancel': function() {
                            alert("Cancel");
                        },
                    });
                next.call(this); // ignore this line
                break;

            case 'shake-and-close':
                box.shake(function() {
                    this.close(5, function() {
                        if (confirm("Try again?"))  {
                            location.reload(true);
                        }
                    });
                });
                break;

        }


    };

    $('.buttons-demo > li > button').on('click', option);

});