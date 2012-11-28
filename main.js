
//TODO - we don't need both nameArray and memberObject, get ride of nameArray
//TODO - do we really need numPayments and payments?

var m_nameArray = [];
var m_memberObject = [];

var OUTPUT_INSTRUCTIONS = "Designate one person as The Bank. Positive values should be paid to The Bank, negative values should be paid by The Bank. The Bank doesn't need to write himself a check."
var INITIAL_INSTRUCTIONS = "Add expenses, enter amount of each expense, and select those who benefited from it. Hold <b>Ctrl</b> to select multiple people, or <b>Shift</b> to select all.";
	
/* handles submission of name list */

$(document).ready(function() {
	$("#addNames").click(function() {
		var names = $("input:first").val();
		if (names != "") {
			$('#addNames').attr('disabled','disabled');
			$('#mainList').append("<p>" + INITIAL_INSTRUCTIONS + "</p>");
			
			m_nameArray = names.split(',');
			m_nameArray = cleanUp(m_nameArray);
			for(var j = 0; j < m_nameArray.length; j++) {
				
				m_memberObject[j] = {};
				m_memberObject[j].id = j;
				m_memberObject[j].name = easterEggizeTheName(m_nameArray[j]);
				m_memberObject[j].numPayments = 0;
				m_memberObject[j].isBank = false;
				m_memberObject[j].valueChange = 0;
				
				$('#mainList').append("<div id='entry" + j + "' class='listEntry'>");
				$('#entry'+j).append("<h3>" + m_nameArray[j] + "'s Expenses </h3>");
				$('#entry'+j).append("<input class='paymentButtons' type='button' name='btnAdd' value='Add an Expense' />");
				$('#entry'+j).append("<input class='paymentButtons' type='button' name='btnRemove' value='Remove an Expense' />");
				$('#mainList').append("</div>");
			}
			
			$('#mainList').append("<input class='calculateButton' type='button' name='calcPayments' value='Calculate Final Expenses' />");
			
			$('.listEntry').children('input[name="btnAdd"]').bind( "click", addPayment );
			$('.listEntry').children('input[name="btnRemove"]').bind( "click", removePayment );
			$('#mainList').children('input[name="calcPayments"]').bind( "click", calcPayments );
		} else {
			$("span").text("Must enter at least one name!").show().fadeOut(2000);
		}
	});
});

/* adds a payment tag set */

function addPayment(event) {
	var divID = event.target.parentNode.id;
	var id = divID[divID.length-1];
	
	$("#"+divID).append("<div class='testClass'>");
	$("#"+divID).append("<input class='paymentAmount' id='amount_" + id + "_payment_" + m_memberObject[id].numPayments + "' type='text' placeholder='$'>");
	$("#"+divID).append("<select id='select_" + id + "_payment_" + m_memberObject[id].numPayments + "' multiple='multiple'>");
	$("#"+divID).append("</div>");
	
	$.each(m_nameArray, function(key, value) {
	     $('#select_' + id + '_payment_' + m_memberObject[id].numPayments)
	          .append($('<option>', { value : key } )
	          .text(value));
	});
	
	m_memberObject[id].numPayments++;
};

/* removes the most recent payment tag set */

function removePayment(event) {
	var divID = event.target.parentNode.id;
	var id = divID[divID.length-1];
	
	if(m_memberObject[id].numPayments >0) {
		m_memberObject[id].numPayments--;
		
		$("#amount_" + id + "_payment_" + m_memberObject[id].numPayments).remove();
		$("#select_" + id + "_payment_" + m_memberObject[id].numPayments).remove();
	}
};

/* calculates the value change, which is the amount of value you gained minus the value you lost, then formats and outputs the result */
function calcPayments() {
	for(var i = 0; i < m_memberObject.length; i++) {
		for(var j = 0; j < m_memberObject[i].numPayments; j++) {
			var payment = {amount : 0, benefs : 0};
			payment.amount = $("#amount_" + i + "_payment_" + j).val();
			payment.benefs = $("#select_" + i + "_payment_" + j).val();

			if(payment.benefs && payment.benefs.length > 0) {
				var amountPerBenef = payment.amount / payment.benefs.length;
				m_memberObject[i].valueChange -= payment.amount;
				for(var m = 0; m < payment.benefs.length; m++) {
					m_memberObject[payment.benefs[m]].valueChange += amountPerBenef;
				}
			}
		}
	}
	$('#outputInstructions').html(OUTPUT_INSTRUCTIONS);
	var finalOutput = "<table>";
	for(var l = 0; l < m_memberObject.length; l++) {
		var change = m_memberObject[l].valueChange;
		var changeFixed = change.toFixed(2);
		if(changeFixed[0]=="-") {
			changeFixed = changeFixed.slice(1);
			changeFixed = '-$' + changeFixed;
		} else {
			changeFixed = '$' + changeFixed;
		}
		
		finalOutput += ("<tr><td>" + m_memberObject[l].name + "</td><td>" + changeFixed + "</td><tr/>");
	}
	finalOutput += ("</table>")
	$('#output').html(finalOutput);
	
	
	for(var k = 0; k < m_nameArray.length; k++) {
		m_memberObject[k].valueChange = 0;
	}

};

/* removes leading whitespace from names */
function cleanUp(array) {
	var tagForRecur = false;
	for(var i = 0; i < array.length; i++) {
		if(array[i][0] == " ") {
			array[i] = array[i].slice(1);
			tagForRecur = true;
		}
	}
	if(tagForRecur) {
		cleanUp(array);
	}
	return array;
};

function easterEggizeTheName(name) {
	var newName = "";
	switch(name) {
	case "Kelsey Warren" :
	case "Kelsey" :
		newName = "Warzone";
		break;
	case "Elizabeth Fletcher" :
	case "Elizabeth" :
		newName = "Yolanda";
		break;
	default :
		newName = name;
	}
	return newName;
}

//this function isn't used, but I'm keeping to here for now for learning sake
function isBank(event) {
	var divID = event.target.parentNode.id;
	var id = divID[divID.length-1];
	m_memberObject[id].isBank = true;
	for(var j = 0; j < m_nameArray.length; j++) {
		if( j != id) {
			$('#entry'+j).children('input[name="isBank"]').attr('checked', false);
			m_memberObject[j].isBank = false;
		}
	}
};

//this function is also not used, again here for reference
String.prototype.visualLength = function() {
    var ruler = $("#ruler")[0];
    ruler.innerHTML = this;
    var offset = ruler.offsetWidth;
    return offset;
};
