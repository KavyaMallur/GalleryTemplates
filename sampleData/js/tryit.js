 
(function($) {
    var numbers = []; 
    var textNumbers;
    var total = 0;
$(document).ready(function() {
    var template1 = {
        "txt":"array()",
        "src":{
            "t": "expr",
            "v": false,
            //change numbers to increase length of array c
            'c|1-1': [

                {
                    "t": "f",
                    "v": "array",
                    'c|2-2': [
                        {
                            //Range of number to be generated
                            "t" : "l",
                            "v|2-99": 0
                        }
                    ]
                }
            ]
        }    
    };
    
    var template2 = {
               "txt": "\\\"Example text\\\"",
               "src": {
                  "t": "expr",
                  "v": false,
                  "c|1-1": [
                     {
                        "t": "l",
                        "v": "Example text"
                     }
                  ]
               }
    };
    
    $('#template textarea').val(formatJSON(template1));
    var wha = $('#result textarea').val(); // reset
    
    $('#button-template1').click(function() {
        $('#template textarea').val(formatJSON(template1));
        $('#button-generate').click();
    });
    
    $('#button-template2').click(function() {
        $('#template textarea').val(formatJSON(template2));
        $('#button-generate').click();
    });
    
    $('#button-generate').click(function() {
        $('#txtInput').removeAttr('value');
        try {
            var json = jQuery.parseJSON($('#template textarea').val());
            $.mockJSON(/mockme\.json/, json);
            
            //alert(formatJSON(template));
            //$('#template textarea').val(formatJSON(template));
        
            $.getJSON('mockme.json', function(json) {
                $('#result textarea').val(formatJSON(json));
                var txtInputValues = $('#txtInput').val();
                var a = $('#result textarea').val();
                var b = a.replace("array()", txtInputValues.toString());
                $('#result textarea').val(b);
                numbers=[];

            });
        } catch(e) {
            alert('Invalid JSON');
        }
    }).click();
    
    $.each($.mockJSON.data, function(keyword) {
        $('#keywords ul').append('<li><code>@' + keyword + '</code></li>');
    });
    var txtInputValues = $('#txtInput').val();
                var a = $('#result textarea').val();
                var b = a.replace("array()", txtInputValues.toString());
                $('#result textarea').val(b);

                
});


function formatJSON(obj, indent) {
    var result = [];
    
    indent = (indent || '') + '  ';
    var type = $.isArray(obj)
        ? 'array' 
        : (obj === null)
            ? 'null'
            : typeof obj;
            
    switch (type) {
        case 'object':
            result.push('{ ');
            for (var i in obj) {
                result.push('"' + i + '" : ' + formatJSON(obj[i], indent) + ',');
            
            }
            var last = result.pop();
            result.push(last.substr(0, last.length - 1));
            result.push('}');
            break;
            
        case 'array':
            result.push('[ ');
            for (var i = 0; i < obj.length; i++) {
                result.push(formatJSON(obj[i], indent) + ',');
            }
            var last = result.pop();
            result.push(last.substr(0, last.length - 1));
            result.push(']');
            break;
            
        case 'string':
            result.push('"' + obj + '"');
            if (type=='string' && result != '"array()"' && result != '"array("' && result != '"f"' && result != '"expr"' && result != '"array"' && result != '"expr"' && result != '\"l\"'){
                numbers.push(result);
                textNumbers = numbers.toString();
                textNumbers = textNumbers.replace(/["]+/g, "");
                //textNumbers = textNumbers.replace(/(\\\"\1\\\"\,)/g, "");
                textNumbers = textNumbers.split(",")
                textNumbers = '\\\"' + textNumbers.join('\\\",\\\"') + '\\\"'; 
                textNumbers = 'array(' + textNumbers + ')'
                $('#txtInput').val(textNumbers);


            }
            break;
            
        default:
            result.push(obj + '');
            if (type=='number' && result > 0 ){
                numbers.push(parseInt(result.toString().replace(/['"]+/g, '')));
                if ($('#order').attr('checked')){
                    numbers.sort(function(a, b){return b-a});
                }
                if ($('#sum').attr('checked') && numbers.length > 0){
                    for (var i = 0; i < numbers.length; i++) {
                    console.log(total);
                    total += numbers[i];

                    }
                    $('#txtSum').val(total);
                    total=0;
                }
                
                /*if (numbers.length > 0) {
                    var x = numbers.pop();
                    x = parseInt(x.toString().replace(/['"]+/g, ''))
                    if (result < x) {
                        numbers.push(parseInt(result));
                        numbers.push(x);
                    } else if (result >= x) {
                        numbers.push(x);
                        numbers.push(parseInt(result));
                    }

                } else if(numbers.length == 0) {
                    

                }*/
                result.pop();
                result.push('"' + obj + '"');

                textNumbers = numbers.toString();
                textNumbers = textNumbers.replace(/["]+/g, "");
                textNumbers = textNumbers.split(",")
                textNumbers = '\\\"' + textNumbers.join('\\\",\\\"') + '\\\"'; 
                textNumbers = 'array(' + textNumbers + ')'
                $('#txtInput').val(textNumbers);


            } else if (type=='number' && result == 1 ){
                result.pop();
                result.push('"' + obj + '"');
            }

            break;
    }
    return result.join('\n' + indent);
    
}


})(jQuery);


