"use strict";

var ruStr = "а А б Б в В г Г д Д е Е ё Ё ж Ж з З и И й Й к К л Л м М н Н о О п П р Р с С т Т у У ф Ф х Х ц Ц ч Ч ш Ш щ Щ ъ Ъ ы Ы ь Ь э Э ю Ю я Я « » – — № `";
var enStr = "a A b B v V g G d D e E yo Yo zh Zh z Z i I y Y k K l L m M n N o O p P r R s S t T u U f F h H ts Ts ch Ch sh Sh sch Sch ' ' i I ' ' e E u U ya Ya \" \" - - # '";

var ruArr = ruStr.split(' ');//формируем массив русских символов
var enArr = enStr.split(' ');//формируем массив латинских символов

function countSms(str) {//подсчет количества SMS-сообщений
	var i = 0;
	var isFind = false;//найден ли русский символ
	while ( i < ruArr.length && !isFind ) {
		isFind = str.includes(ruArr[i]);
		i++;
	}
	var count;
	if ( isFind ) {
		if ( str.length <= 70 ) {
			count = 1;
		} else {
			count = Math.ceil(str.length / 67);
		}
	} else {
		if ( str.length <= 160 ) {
			count = 1;
		} else {
			count = Math.ceil(str.length / 153);
		}		
	}
	return count;
}

$(document).ready(function() {//добавляем события на элементы страницы
    
	$('#form1').submit(function(e){//обработка отправки формы
		$('#mySubmit').prop('disabled', true);//отключаем кнопку сохранить
		$('#mySubmit').val('Сохранение..');//меняем текст кнопки сохранить на сохранение..
		var data = $(this).serialize()
		$.ajax({
			url: 'action.php',
			type: 'POST',
			data: data,
			success: function(res){
				var result = JSON.parse(res);
				console.log(result);
				createNotify(result['message'], result['countSms'], result['errors']);//вызываем функцию создания уведомления о результате запроса
			},
			error: function(){
				console.log('Произошла ошибка!');
			},
			complete: function(){
				$('#mySubmit').prop('disabled', false);//активируем кнопку сохранить
				$('#mySubmit').val('Сохранить');//возвращаем кнопке текст сохранить
			}
		});
		e.preventDefault();
	});
	
	$('#message').bind('input propertychange', function() {//событие при изменении текста сообщения
		$('#countSymbols').val( $('#message').val().length );//выводим количество символов
		$("#countSms").val( countSms( $('#message').val() ) );//выводим количество сообщений
	});

	$('#transliteration').change(function() {//транслитерация
		var message = $('#message').val();
		if ( this.checked ) {
			for ( var i = 0; i < ruArr.length; i++ ) {//проходим по массиву русских символов и меняем все вхождения на аналогичные латинские
				message = message.split(ruArr[i]).join(enArr[i]);
			}
		} else {
			for ( var i = 0; i < enArr.length; i++ ) {
				message = message.split(enArr[i]).join(ruArr[i]);
			}
		}       
		$('#message').val(message);
		$('#message').trigger('propertychange');//обновляем значение количества сообщений
	});
});
