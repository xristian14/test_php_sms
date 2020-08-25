"use strict";

var noitifyId = 0; //id для нового элемента notify

function createNotify(message, countSms, errors) {//создает блок уведомления о результате запроса
	var maxNotify = 5;//максимальное количество отображаемых уведомлений, превышающие этот лимит будут удалены
	var messageForDisplay = message;
	if ( message.length > 30 ) {
		messageForDisplay = message.substring(0, 30) + '..'; //обрезаем сообщение до 30 символов для вывода
	}
	var success = true;
	if ( errors.length != 0 ) {
		success  = false;
	}
	noitifyId++;
	var error = '';
	for ( var i = 0; i < errors.length; i++ ){
		error += errors[i] + ', ';
	}
	error = error.substring(0, error.length - 2); //удаляем последнюю запятую
	var content = '';
	if ( success ) { //если сохранение прошло успешно
		content += '<div class="notify notifySuccess" id="notify_' + noitifyId + '">';
	} else { //иначе, если ошибка
		content += '<div class="notify notifyError" id="notify_' + noitifyId + '">';
	}
	if ( success ) {
		content += '<span class="notifyHeader">Добавлена запись: </span><span class="notifyText">' + messageForDisplay + ', ' + countSms + '</span>';
	} else {
		content += '<span class="notifyHeader">Ошибка: </span><span class="notifyText">' + error + '</span>'
	}
	content += '</div>';
	
	var j = noitifyId - maxNotify;
	while ( j > 0 ) {//удаляем элементы notify, выходящие за рамки последних maxNotify созданных
		if ( $('#notify_' + j).length > 0 ) {//если элемент с id существует
			deleteNotify( $('#notify_' + j), 0 );
		}
		j--;	
	}
	var k = noitifyId - 1;
	var bottomBefore; //текущее значение отступа снизу
	var bottom; //новое значение отступа снизу
	while ( k > 0 && ( noitifyId - k ) <  ( maxNotify + 1 ) ) {//сдвигаем вверх все элементы notify
		if ( $('#notify_' + k).length > 0 ) {//если элемент с id существует
			bottomBefore = $('#notify_' + k).css('bottom');//текущий отступ bottom
			bottom = ( Number( bottomBefore.substring(0, bottomBefore.length - 2) ) + 24 ) + 'px';//добавляем к нему 24
			$('#notify_' + k).css( 'bottom', bottom );
		}
		k--;
	}
	$('#notifyContainer').html( $('#notifyContainer').html() + content ); //добавляем созданный элемент в блок #notifyContainer на странице
	setTimeout( addClassFunc, 50, $('#notify_' + noitifyId), "notifyShow" );//добавляем класс notifyShow с задержкой, т.к. иначе анимация открытия не проигрывается, т.к. элемент создан динамически
	deleteNotify( $('#notify_' + noitifyId), 5000 );//удаляем созданный элемент через 5 секунд
}

function deleteNotify(element, additionalDelay) {//активирует анимацию закрытия и после удаляет элемент; additionalDelay - дополнительная задержка перед запуском удаления
	setTimeout( removeClassFunc, 50 + additionalDelay, $( '#' + element.attr('id') ), "notifyShow" );//удаляем класс notifyShow, после чего пойдет анимация закрытия
	setTimeout( removeFunc, 100 + additionalDelay, $( '#' + element.attr('id') ) );//удаляем элемент notify после задержки, для завершения анимации закрытия
}

function addClassFunc(element, className) {
	element.addClass( className );
}

function removeClassFunc(element, className) {//удаляет класс у элемента
	if ( $( '#' + element.attr('id') ).length > 0 ) {//если элемент с id существует
		$( '#' + element.attr('id') ).removeClass( className );
	}
}

function removeFunc(element) {//удаляет элемент со страницы
	if ( $( '#' + element.attr('id') ).length > 0 ) {//если элемент с id существует
		$( '#' + element.attr('id') ).remove();
	}
}