Sample = [{ "id":"523e49ca", "data":["https://static.klipfolio.com/images/rand-fishkin-dashboard/awareness.png"]},{ "id":"19cd644a-11", "data":["","Facebook Posts","Facebook Fans","Twitter Followers","Brand Mentions","Branded Search"]},{ "id":"12273d2c-11", "data":[67.5,45,7402.5,0,0,33975]},{ "id":"a9a319a2-9", "data":[48,25.6,5248,0,0,49315.200000000004]},{ "id":"b8b5be19-7", "data":["","-0.431111111111111056093392335242242552340030670166015625","-0.29105032083755488780951736771385185420513153076171875","NaN","NaN","0.451514348785872099423244208082905970513820648193359375"]},{ "id":"90f4927e-5", "data":[49.5,16.5,5402.099999999999,0,0,47226.299999999996]},{ "id":"60ebc7ee-3", "data":["","-0.355468750000000055511151231257827021181583404541015625","0.02936356707317062941786645069441874511539936065673828125","NaN","NaN","-0.042358137044968054152338510220943135209381580352783203125"]},{ "id":"079540ce-13", "data":[38.4,16.8,3912,0,0,43406.4]},{ "id":"78075402-1", "data":["","0.0181818181818182260378602421724281157366931438446044921875","-0.275837174432165210813394651268026791512966156005859375","NaN","NaN","-0.08088501534102808532278316988595179282128810882568359375"]},{ "id":"639f7d2a-15", "data":[51.2,16,5232,0,0,64057.600000000006]},{ "id":"c48460d3-1", "data":["","-0.04761904761904765803759431719299755059182643890380859375","0.337423312883435577713697739454801194369792938232421875","NaN","NaN","0.475763942644402748616272447179653681814670562744140625"]},{ "id":"4ba85079-17", "data":[51.2,22.400000000000002,5241.6,9929.6,3052.8,41443.200000000004]},{ "id":"e8ef4257-3", "data":["","0.4000000000000001332267629550187848508358001708984375","0.00183486238532117040822555509294033981859683990478515625"," "," ","-0.353032270956139482276370245017460547387599945068359375"]},]

function roundFloat(n){
	return ( !isNaN(parseInt(n)) && n !=  parseInt(n, 10) ) ? parseFloat(n).toFixed(4) : n;
}

function fakeData (fake){
	var temp = {};
	fake.forEach(function(fakeElement){
		if (fakeElement.data.length == 1){
			var txt = "\""+roundFloat(fakeElement.data[0])+"\"";
			var src = {"t":"expr", "v": false, "c": [{"t":"l", "v": roundFloat(fakeElement.data[0])}]};
		} else {
			var txt = "array(";
			var src = {"t":"expr","v":false,"c":[{"t":"f","v":"array","c":[]}]}
			for (var i = 0; i < fakeElement.data.length; i++){
				txt = txt+"\""+roundFloat(fakeElement.data[i])+"\",";
				src.c[0].c[i] = {"t":"l", "v":roundFloat(fakeElement.data[i])};
			}
			txt = txt.slice(0,-1)+")";
		}
	temp[fakeElement.id] = {"txt": txt, "src": src};
	});
    return temp;
}
console.log(JSON.stringify(fakeData(Sample)));