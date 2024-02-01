// ==UserScript==
// @name         Better Quick Stock
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  makes the quick stock in neopets a little bit better
// @author       brunodemarchi
// @match        http://www.neopets.com/quickstock.phtml
// @grant        none
// ==/UserScript==

//$(document).ready(function () {

	// Find all <b> elements and filter them based on text content
	$('b').filter(function() {
		
		if($(this).text() === 'Quick Stock'){
			$(this).text('Better Quick Stock');
		}
	});

	//removes neopets treatment
	$('[ondblclick]').each(function () {
		$(this).attr('ondblclick', '');
	});

	//select all
	$('input[name="checkall"]').attr('onclick', '').replaceWith('<input type="checkbox" class="check_all">');
	$('.check_all').on('click', function () {
		$('.check_all').not(this).removeAttr('checked');
		var $this = $(this),
			tdIndex = $this.parent().index(),
			checked = $this.is(':checked');

		$('form[name="quickstock"] tr').each(function () {
			var everyOtherTd = $(this).find('td:not(:eq(' + tdIndex + '))'),
				selectedTd = $(this).find('td').eq(tdIndex),
				radio = selectedTd.find('input[type="radio"]'),
				bgcolor = $(this)[0].getAttribute('bgcolor'),
				backgroundColor = bgcolor == "#FFFFFF" ? "#eee" : "#E5E5B7";

			if (checked) {
				everyOtherTd.each(function () {
					var radio = $(this).find('input[type="radio"]');

					$(this).css('background', "transparent");

					toggleChecked(radio, false, true);
				});
			}

			selectedTd.css('background', checked ? backgroundColor : "transparent");

			toggleChecked(radio, checked, !checked);
		});
	});

	$('input[type="radio"]').css('cursor', 'pointer');


	$('input[type="radio"]').parent('form[name="quickstock"] td[align="center"]').on('click', function () {
		var radio = $(this).find('input[type="radio"]'),
			checked = !radio.hasClass("checked"),
			parent_tr = $(this).parent(),
			everyOtherTd = parent_tr.find('td').not(this);
	
		if (checked) {
			everyOtherTd.each(function () {
				var radio = $(this).find('input[type="radio"]');
				$(this).css('background', "transparent");
				toggleChecked(radio, false, true);
			});
		}
	
		toggleChecked(radio);
	}).on('mouseenter mouseleave', function (e) { // Use mouseenter and mouseleave instead of hover
		var radio = $(this).find('input[type="radio"]'),
			bgcolor = $(this).parent('tr').css('background-color'), // Use .css('background-color') to get the background color
			backgroundColor = bgcolor === "rgb(255, 255, 255)" ? "#eee" : "#E5E5B7";
	
		if (e.type === "mouseenter" || (e.type === "mouseleave" && radio.hasClass('checked'))) {
			$(this).css('background', backgroundColor);
			$(this).css('cursor', "pointer");
		} else {
			$(this).css('background', "transparent");
			$(this).css('cursor', "auto");
		}
	});

	//adds checkboxes for sections
	$('tr[bgcolor="#EEEEBB"]').each(function () {
		var $this = $(this),
			th = $this.find('th:contains("Stock"),th:contains("Deposit"), th:contains("Donate"), th:contains("Discard"), th:contains("Gallery"), th:contains("Closet"), th:contains("Shed")');
		th.each(function () {
			$(this).append('<input type="checkbox" class="checkbox_all_section">');
			$(this).css("width", "11%");
		});
	});

	//checkboxes sections treatment
	$('.checkbox_all_section').on('click', function () {
		$('.checkbox_all_section').not(this).removeAttr('checked');
		var $this = $(this),
			checked = $this.is(':checked'),
			parent_td = $this.parent(),
			tdIndex = parent_td.index(),
			parent_tr = parent_td.parent(),
			next_tr_list = parent_tr.nextUntil('tr[bgcolor="#EEEEBB"], tr[bgcolor="#eeeebb"]');

		next_tr_list.each(function () {
			var $this = $(this),
				everyOtherTd = $this.find('td:not(:eq(' + tdIndex + '))'),
				selectedTd = $this.find('td').eq(tdIndex),
				radio = selectedTd.find('input[type="radio"]'),
				bgcolor = $this[0].getAttribute('bgcolor'),
				backgroundColor = bgcolor == "#FFFFFF" ? "#eee" : "#E5E5B7";

			if (checked) {
				everyOtherTd.each(function () {
					var radio = $(this).find('input[type="radio"]');

					$(this).css('background', "transparent");

					toggleChecked(radio, false, true);
				});
			}
			selectedTd.css('background', checked ? backgroundColor : "transparent");

			toggleChecked(radio, checked, !checked);
		});
	});

//});

/***********************
 FUNCTIONS
 ***********************/

function toggleChecked(el, check, uncheck) {
	var check = check || "";
	var uncheck = uncheck || "";

	if (check) {
		el.prop('checked', true)
			.addClass('checked');
	} else if (uncheck) {
		el.prop('checked', false)
			.removeClass('checked');
	} else {
		if (el.hasClass('checked')) {
			el.prop('checked', false)
				.toggleClass('checked');
		} else {
			el.prop('checked', true)
				.toggleClass('checked');
		}
	}
}


//Neokazam!


var actions = ["Stock","Deposit","Donate","Discard","Gallery","Closet","Shed"];
function checkOff(event) {
	if (event.type == "keyup" && event.keyCode != 13) return;
	var query = document.getElementById("quickSearch").value;
	if (query.length < 3) return;
	var radios = document.querySelectorAll("input[name=actions][type=radio]");
	var checked;

	for (checked = 0; checked < radios.length; checked++) {
		if (radios[checked].checked) break;
	}

	checked++;
	var rows = document.querySelectorAll("form[name=quickstock] table tr");
	for (var r=0;r<rows.length;r++) {
		var cells = rows[r].querySelectorAll("td");
		for (var c=0;c<cells.length;c++) {
			if (cells[c].innerHTML.match(new RegExp(query,"i"))) {
				try {
					var isChecked = cells[c+checked].querySelector("input[type=radio]").checked;

					console.log(isChecked);

					if(isChecked){
						cells[c+checked].querySelector("input[type=radio]").checked = false;
					} else {
						cells[c+checked].querySelector("input[type=radio]").checked = true;
					}
				} catch(err) {}
			}
		}
	}
}
var formStock = document.querySelector("form[name=quickstock]");
if (formStock != null) {
	var searchBox = document.createElement('div');
	formStock.parentNode.insertBefore(searchBox,formStock);
	var radios = "";
	for (var i = 0; i < actions.length; i++) {
		radios += '<td><input '+(i==0?'checked ':'')+'type="radio" name="actions" id="search'+actions[i]+'" /><label for="search'+actions[i]+'">'+actions[i]+'</label></td>'
	}
	searchBox.innerHTML = '<fieldset style="margin-bottom:10px"><legend>QuickCheck</legend>'
	+'<table style="width:100%"><tr><td><input id="quickSearch" type="search" placeholder="Query" /></td>'
	+radios
	+'<td><input id="quickSearchButton" type="button" value="Check off" /></td></tr></table></fieldset>';
	document.getElementById("quickSearchButton").addEventListener("click", checkOff);
	document.getElementById("quickSearch").addEventListener("keyup", checkOff);
}
