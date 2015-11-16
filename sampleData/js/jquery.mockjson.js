(function($) {

var _mocked = [];
$.mockJSON = function(request, template) {
    for (var i = 0; i < _mocked.length; i++) {
        var mock = _mocked[i];
        if (mock.request.toString() == request.toString()) {
            _mocked.splice(i, 1);
            break;
        }
    }

    _mocked.push({
        request:request,
        template:template
    });
    
    return $;
};

$.mockJSON.random = false;


var _original_ajax = $.ajax;
$.ajax = function(options) {
    if (options.dataType === 'json') {
        for (var i = 0; i < _mocked.length; i++) {
            var mock = _mocked[i];
            if (mock.request.test(options.url)) {
                options.success($.mockJSON.generateFromTemplate(mock.template));
                return $;
            }
        }
    }
    
    return _original_ajax.apply(this, arguments);
}


$.mockJSON.generateFromTemplate = function(template, name) {
    var length = 0;
    var matches = (name || '').match(/\w+\|(\d+)-(\d+)/);
    if (matches) {
        var length_min = parseInt(matches[1], 10);
        var length_max = parseInt(matches[2], 10);
        length = Math.round(rand() * (length_max - length_min)) + length_min;
    }
        
    var generated = null;
    switch (type(template)) {
        case 'array':
            generated = [];
            for (var i = 0; i < length; i++) {
                generated[i] = $.mockJSON.generateFromTemplate(template[0]);
            }
            break;

        case 'object':
            generated = {};
            for (var p in template) {
                generated[p.replace(/\|(\d+-\d+|\+\d+)/, '')] = $.mockJSON.generateFromTemplate(template[p], p);
                var inc_matches = p.match(/\w+\|\+(\d+)/);
                if (inc_matches && type(template[p]) == 'number') {
                    var increment = parseInt(inc_matches[1], 10);
                    template[p] += increment;
                }
            }
            break;

        case 'number':
            generated = (matches)
                ? length
                : template;
            break;

        case 'boolean':
            generated = (matches)
                ? rand() >= 0.5
                : template;
            break;

        case 'string':
            if (template.length) {
                generated = '';
                length = length || 1;
                for (var i = 0; i < length; i++) {
                    generated += template;
                }
                var keys = generated.match(/@([A-Z_0-9\(\),]+)/g) || [];
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var randomData = getRandomData(key);
                    generated = generated.replace(key, randomData);
                    if (type(randomData) == 'number')
                        generated = Number(generated);
                }
                //console.log(generated);
            } else {
                generated = ""
                for (var i = 0; i < length; i++) {
                    generated += String.fromCharCode(Math.floor(rand() * 255));
                }
            }
            break

        default:
            generated = template;
            break;
        
    }
    return generated;

}


function getRandomData(key) {
    key = key.substr(1); // remove "@"
    
    //var params = key.match(/\(((\d+),?)+\)/g) || [];
    var params = key.match(/\(([^\)]+)\)/g) || [];
    
    if (!(key in $.mockJSON.data)) {
        console.log(key);
        console.log(params);
        return key;
    }
    
    var a = $.mockJSON.data[key];
    
    switch (type(a)) {
        case 'array':
            var index = Math.floor(a.length * rand());
            return a[index];
            
        case 'function':
            return a();
    }
}


function type(obj) {
    return $.isArray(obj)
        ? 'array' 
        : (obj === null)
            ? 'null'
            : typeof obj;
}


function pad(num) {
    if (num < 10) {
        return '0' + num;
    }
    return num + '';
}

var _random_numbers = [0.021768910889510606,0.23762323165420307,0.9079616118204306,0.6534305309997466,0.22049697572443694,0.07687466163364898,0.8017428775547905,0.16165353264404825,0.5124345671670483,0.19337327636624613,0.39963994200698416,0.8012592654139514,0.22474962687229938,0.9791396234452399,0.7965428353317756,0.9777664340629622,0.5135216702983731,0.7407128236192145,0.12880984991420075,0.8186600800491484,0.5187691445438851,0.034723021925916586,0.5625092833040853,0.02502838571997701,0.663696305503698,0.3481608684353138,0.8991623585175106,0.3640542564277087,0.8320766874121723,0.012778915627689846,0.1427680370061336,0.9774408289203956,0.010229381207667587,0.2596610885223093,0.6150540104297127,0.7130773919030915,0.8638338302974085,0.6178483032907357,0.980312844391733,0.5007277415012348,0.6348672031113127,0.4400097775503303,0.8468458451408212,0.38724997893647317,0.690237920987028,0.19850102297146477,0.44895115941315766,0.22283381913760725,0.031228117310125314,0.3367510872581615,0.28155752394210787,0.14696694832580504,0.08164635161760991,0.8837733477785624,0.4590179148539142,0.9613195413217465,0.11263127577456922,0.743695635896287,0.0002424891439143373,0.1964622832546613,0.7333363138878922,0.5575568682003356,0.20426374168098604,0.18030934250338893,0.9792636408392759,0.30121911048336913,0.7734906886720265,0.6984051127767527,0.6638058511379343,0.3310956256388182,0.36632372827973203,0.8996494702333895,0.8235917663049763,0.418496734118911,0.8164648495097332,0.9457831606354686,0.2845227542117049,0.42374718399151545,0.3431728911657228,0.5289314006219973,0.6029243600407113,0.6528301140700757,0.6948768236197832,0.7887302784092911,0.8950274196119906,0.6121642239166305,0.31797481561514696,0.34903732589844216,0.3580320092281766,0.8312225728434115,0.32331010157206974,0.16395388672837796,0.6072960306003872,0.6580526967999424,0.23472961545632742,0.6138637855489343,0.3067303339060682,0.44935935129958315,0.24729465243280668,0.8244189715967711];
function rand() {
    if ($.mockJSON.random) {
        return Math.random();
    } else {
        _random_numbers = _random_numbers.concat(_random_numbers.splice(0,1));
        return _random_numbers[0];
    }
}


function randomDate() {
    return new Date(Math.floor(rand() * new Date().valueOf()));
}


$.mockJSON.data = {
    NUMBER : "0123456789".split(''),
    LETTER_UPPER : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(''),
    LETTER_LOWER : "abcdefghijklmnopqrstuvwxyz".split(''),
    MALE_FIRST_NAME : ["James", "John", "Robert", "Michael", "William", "David",
        "Richard", "Charles", "Joseph", "Thomas", "Christopher", "Daniel", 
        "Paul", "Mark", "Donald", "George", "Kenneth", "Steven", "Edward",
        "Brian", "Ronald", "Anthony", "Kevin", "Jason", "Matthew", "Gary",
        "Timothy", "Jose", "Larry", "Jeffrey", "Frank", "Scott", "Eric"],
    FEMALE_FIRST_NAME : ["Mary", "Patricia", "Linda", "Barbara", "Elizabeth", 
        "Jennifer", "Maria", "Susan", "Margaret", "Dorothy", "Lisa", "Nancy", 
        "Karen", "Betty", "Helen", "Sandra", "Donna", "Carol", "Ruth", "Sharon",
        "Michelle", "Laura", "Sarah", "Kimberly", "Deborah", "Jessica", 
        "Shirley", "Cynthia", "Angela", "Melissa", "Brenda", "Amy", "Anna"], 
    LAST_NAME : ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller",
        "Davis", "Garcia", "Rodriguez", "Wilson", "Martinez", "Anderson",
        "Taylor", "Thomas", "Hernandez", "Moore", "Martin", "Jackson",
        "Thompson", "White", "Lopez", "Lee", "Gonzalez", "Harris", "Clark",
        "Lewis", "Robinson", "Walker", "Perez", "Hall", "Young", "Allen"],
    ANY_FIRST_NAME : ["Austin","Yoshi","Chase","Vivien","Cadman","Talon","Libby","Malik","Evan","Carl","Mariam","Theodore","Raya","Orli","Lillith","Brendan","Samantha","Chaim","Mohammad","Cecilia","Karly","Nero","Xavier","Odysseus","Britanni","Dakota","Brent","Leila","Clinton","Aladdin","Lucas","Cassidy","Madeline","Giselle","Tara","Nissim","Alexa","Idola","Zeus","Aiko","Rahim","Leah","Roth","Hoyt","Ulysses","Marcia","Marsden","Kirestin","Quyn","Tashya","Ulla","Drew","Emi","Quinn","Hayden","Prescott","Candace","Evan","Freya","Price","Eve","Timothy","McKenzie","Breanna","Lucius","Gareth","Shelly","Heidi","Nolan","Venus","Jael","Kennedy","Ann","Kelsie","Lilah","Anika","Emery","Catherine","Marshall","Rajah","Rylee","Perry","Octavia","Velma","Xanthus","Drake","Alea","Denise","Galvin","Galena","Chanda","Barrett","Selma","Clarke","Byron","Ivor","Vance","Linus","Eagan","Martha"],
    COUNTRY_CODES : ["AD","AE","AF","AG","AI","AL","AM","AN","AO","AQ","AR","AS","AT","AU","AW","AZ","BA","BB","BD","BE","BF","BG","BH","BI","BJ","BM","BN","BO","BR","BS","BT","BV","BW","BY","BZ","CA","CC","CD","CF","CH","CI","CK","CL","CM","CN","CO","CR","CU","CV","CX","CY","CZ","DE","DJ","DK","DM","DO","DZ","EC","EE","EG","EH","ER","ES","ET","FI","FJ","FK","FM","FO","FR","FX","GA","GD","GE","GF","GH","GI","GL","GM","GN","GP","GQ","GR","GS","GT","GU","GW","GY","HK","HM","HN","HR","HT","HU","ID","IE","IL","IN","IO","IQ","IR","IS","IT","JM","JO","JP","KE","KG","KH","KI","KM","KN","KP","KR","KW","KY","KZ","LA","LB","LC","LI","LK","LR","LS","LT","LU","LV","LY","MA","MC","MD","ME","MG","MH","MK","ML","MM","MN","MO","MP","MQ","MR","MS","MT","MU","MV","MW","MX","MY","MZ","NA","NC","NE","NF","NG","NI","NL","NO","NP","NR","NT","NU","NZ","OM","PA","PE","PF","PG","PH","PK","PL","PM","PN","PR","PT","PW","PY","QA","RE","RO","RS","RU","RW","SA","SB","SC","SD","SE","SG","SH","SI","SJ","SK","SL","SM","SN","SO","SR","SS","ST","SU","SV","SY","SZ","TC","TD","TF","TG","TH","TJ","TK","TM","TN","TO","TP","TR","TT","TV","TW","TZ","UA","UG","GB","UM","US","UY","UZ","VA","VC","VE","VG","VI","VN","VU","WF","WS","YE","YT","YU","ZA","ZM","ZR","ZW"],
    COUNTRY_NAMES : ["Andorra","United Arab Emirates","Afghanistan","Antigua and Barbuda","Anguilla","Albania","Armenia","Netherlands Antilles","Angola","Antarctica","Argentina","American Samoa","Austria","Australia","Aruba","Azerbaijan","Bosnia and Herzegovina","Barbados","Bangladesh","Belgium","Burkina Faso","Bulgaria","Bahrain","Burundi","Benin","Bermuda","Brunei Darussalam","Bolivia","Brazil","Bahamas","Bhutan","Bouvet Island","Botswana","Belarus","Belize","Canada","Cocos (Keeling Islands)","Congo","Central African Republic","Switzerland","Cote D'Ivoire (Ivory Coast)","Cook Islands","Chile","Cameroon","China","Colombia","Costa Rica","Cuba","Cape Verde","Christmas Island","Cyprus","Czech Republic","Germany","Djibouti","Denmark","Dominica","Dominican Republic","Algeria","Ecuador","Estonia","Egypt","Western Sahara","Eritrea","Spain","Ethiopia","Finland","Fiji","Falkland Islands (Malvinas)","Micronesia","Faroe Islands","France","France"," Metropolitan","Gabon","Grenada","Georgia","French Guiana","Ghana","Gibraltar","Greenland","Gambia","Guinea","Guadeloupe","Equatorial Guinea","Greece","S. Georgia and S. Sandwich Isls.","Guatemala","Guam","Guinea-Bissau","Guyana","Hong Kong","Heard and McDonald Islands","Honduras","Croatia (Hrvatska)","Haiti","Hungary","Indonesia","Ireland","Israel","India","British Indian Ocean Territory","Iraq","Iran","Iceland","Italy","Jamaica","Jordan","Japan","Kenya","Kyrgyzstan (Kyrgyz Republic)","Cambodia","Kiribati","Comoros","Saint Kitts and Nevis","Korea (North) (People's Republic)","Korea (South) (Republic)","Kuwait","Cayman Islands","Kazakhstan","Laos","Lebanon","Saint Lucia","Liechtenstein","Sri Lanka","Liberia","Lesotho","Lithuania","Luxembourg","Latvia","Libya","Morocco","Monaco","Moldova","Montenegro","Madagascar","Marshall Islands","Macedonia","Mali","Myanmar","Mongolia","Macau","Northern Mariana Islands","Martinique","Mauritania","Montserrat","Malta","Mauritius","Maldives","Malawi","Mexico","Malaysia","Mozambique","Namibia","New Caledonia","Niger","Norfolk Island","Nigeria","Nicaragua","Netherlands","Norway","Nepal","Nauru","Neutral Zone (Saudia Arabia/Iraq)","Niue","New Zealand","Oman","Panama","Peru","French Polynesia","Papua New Guinea","Philippines","Pakistan","Poland","St. Pierre and Miquelon","Pitcairn","Puerto Rico","Portugal","Palau","Paraguay","Qatar","Reunion","Romania","Serbia","Russia","Rwanda","Saudi Arabia","Solomon Islands","Seychelles","Sudan","Sweden","Singapore","St. Helena","Slovenia","Svalbard and Jan Mayen Islands","Slovakia (Slovak Republic)","Sierra Leone","San Marino","Senegal","Somalia","Suriname","South Sudan","Sao Tome and Principe","Soviet Union (former)","El Salvador","Syria","Swaziland","Turks and Caicos Islands","Chad","French Southern Territories","Togo","Thailand","Tajikistan","Tokelau","Turkmenistan","Tunisia","Tonga","East Timor","Turkey","Trinidad and Tobago","Tuvalu","Taiwan","Tanzania","Ukraine","Uganda","United Kingdom","US Minor Outlying Islands","United States","Uruguay","Uzbekistan","Vatican City State (Holy See)","Saint Vincent and The Grenadines","Venezuela","Virgin Islands (British)","Virgin Islands (US)","Viet Nam","Vanuatu","Wallis and Futuna Islands","Samoa","Yemen","Mayotte","Yugoslavia","South Africa","Zambia","Zaire","Zimbabwe"], 
    OPPORTUNITY_STAGES : ["Prospecting","Qualification","Needs Analysis","Value Proposition","Id. Decision Makers","Percetion Analysis","Proposal/Price Quote","Negotiation/Review", "Payment Declined", "Confirm"],
    CAMPAIGN_NAME: ["Where a kid is a kid", "Your homely state farm", "Desire it. Buy it.", "Once you go Up", "Never Miss", "Nothing is impossible", "Success is a mind game", "It’s freaking good", "It gives you wings", "We could ask for anything", "We have a substitude", "diamonds are forever", "Solutions for our planet", "Make it great", "At the heart of the city", "Work your imagination", "More saving", "Do more", "It is live!", "Come Home", "It takes a licking without breaking", "Connect People", "That Synergy!", "Intelligence inside", "Always eat fresh", "you’ll never Dump", "Simple as ABC", "Quality never goes away", "Do me a favour", "Get the door now", "Good to the last", "Sell and love it", "Wealth growth and protection", "Jump On It", "Who will do it?", "Be silly!", "Think outside the box", "Cool possibilities", "Get Up!", "Your dream has powers"],
        AD_SET: ["Enchanting", "Undulating", "Trite", "Enchanting", "Undulating", "Trite", "Enchanting", "Undulating", "Trite", "Enchanting", "Undulating", "Trite", "Enchanting", "Undulating", "Trite", "Enchanting", "Undulating", "Enchanting", "Undulating", "Trite", "Awkward", "Caring", "Hyperactive", "Womanly", "Fascinated", "Loyal", "Terrified", "Rusty", "Immaculate", "Buxom", "Flippant", "Harmonious", "Resolute", "Incompetent", "Expensive", "Minor", "Tender", "Unlucky", "Sassy", "Confused", "Shaky", "Hesitant", "Deeply", "Overt", "Tranquil", "Entertaining", "Great", "Impartial", "Weary", "Reliable", "Tangy", "Succinct", "Sanguine", "Tranquil", "Poor", "Latin", "Selfless", "Tall", "Glib", "Courageous", "Curved", "Longing", "Minor", "Breezy", "Excellent", "Alert", "Turgid", "Discouraged", "Lamentable", "Impolite", "Harsh", "Abashed", "Sweet", "Wacky", "Violent", "Deep", "Hollow", "Wobbly", "Exhibitionist", "Logical", "Utter", "Cuddly", "Permissible", "Woozy", "Fey", "Alive", "Internal", "Weary", "Coherent", "Divergent", "Bad", "Unaccountable", "Scary", "Mad", "Foolish", "Paranoid", "Wary", "Jovial", "Accidental", "Decisive"],
        AD: ["Rib", "Wrench", "Shrimp", "Squarks", "Rough", "Photon", "Argon", "Lanthanum", "Persimmon", "Primrose", "Cooker", "Boron", "Photon", "Rutherfordium", "Berkelium", "Argon", "Higgsino", "Beer", "Willow", "Denim", "Polarons", "soda", "bread", "Corpus", "Christi", "Factory", "Krunch", "Electric", "Oven", "Food", "Wholesale", "Domain", "Branon", "turnover", "Fullerton", "Basilica", "Krumbles", "Freezer", "Gaming", "Activities", "Wax", "Anyons", "turnover", "Tampa", "Stock", "Exchange", "Balls", "Washing", "Machine", "Home", "Health", "Care", "Mint", "Phonons", "petit", "four", "Abilene", "Hayloft", "Harvest", "Washing", "Machine", "Regional:", "Southeast", "Banks", "Hat", "Branon", "coffe", "cake", "Aurora", "Nightclub", "Harvest", "Electric", "Pan", "Asset", "Management", "Jumbo", "Sneutrino", "bun", "San", "Diego", "Concert", "Hall", "Coin", "Electron", "brownie", "Oxnard", "Forum", "Crunch", "Gas", "Range", "Rubber", "Plastics", "Hippopotamus", "Electron", "biscotti", "Amarillo", "Grainery", "Oats", "Refrigerator", "Shipping", "Beetle", "Polaritons", "éclair", "Portsmouth", "Jazz", "Club", "Krunch", "Refrigerator", "Business", "Equipment", "Map", "Squarks", "danish", "Peoria", "Concert", "Hall", "Shreddies", "Electric", "Water", "Heater", "Foreign", "Regional"],
        WEBSITE: ["globex.com","acme.com","skynet.com","example.com","mycompany.com","sampleklips.com","superklips.com","awesomeklips.com","amazingklips.com","goodklips.com","klipstore.com"],
    DECIMAL_NUMBER : function() {
        var decimal = (Math.random()*49+1).toFixed(2);
        return decimal;
    },
    EMAIL : function() {
        return getRandomData('@LETTER_LOWER')
            + '.'
            + getRandomData('@LAST_NAME').toLowerCase()
            + '@'
            + getRandomData('@LAST_NAME').toLowerCase()
            + '.com';
    },
    DATE_YYYY : function() {
        var yyyy = randomDate().getFullYear();
        return yyyy + '';
    },
    DATE_DD : function() {
        return pad(randomDate().getDate());
    },
    DATE_MM : function() {
        return pad(randomDate().getMonth() + 1);
    },
    TIME_HH : function() {
        return pad(randomDate().getHours());
    },
    TIME_MM : function() {
        return pad(randomDate().getMinutes());
    },
    TIME_SS : function() {
        return pad(randomDate().getSeconds());
    },
    LOREM : function() {
        var words = 'lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ');
        var index = Math.floor(rand() * words.length);
        return words[index];
    },
    LOREM_IPSUM : function() {
        var words = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ');
        var result = [];
        var length = Math.floor(rand() * words.length / 2);
        for (var i = 0; i < length; i++) {
            var index = Math.floor(rand() * words.length);
            result.push(words[index]);
        }
        return result.join(' ');
    }
};


})(jQuery);
