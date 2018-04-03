/**
 *  @description freebitco.in / freedoge.co.in / freenem.com [ MultiCaptcha bot]
 *  @since Tue Apr 03 2018 01:07:27 GMT+0300 (MSK)
 *  @version 5.1.0
 *  @tutorial https://multicaptchabot.wixsite.com/multicaptchabot/instruction
 *  @author AlexanderFSP<https://github.com/AlexanderFSP>
 *
 *  [ Инструкция ]:
 * 	⑴ Настройте браузер перед запуском согласно инструкции на сайте: https://multicaptchabot.wixsite.com/multicaptchabot/instruction;
 *   	⑵ Обязательно авторизируйтесь на всех сайтах, на которых Вы будете использовать бота;
 *   	⑶ Зарегистрируйтесь и пополните счёт на сервисе распознавания капчи: https://rucaptcha.com/pay;
 *   	⑷ Внимание, не забудьте проделать следующие действия:
 *      	▻ Создать папку MultiCaptcha_bot на диске C;
 *       	▻ Вставить Ваш API KEY с сервиса ruCaptcha.com(https://rucaptcha.com/enterpage) / 2Captcha.com (Строка №30);
 *       	▻ Активировать нужные краны (Строки №33, 38, 42);
 *       	▻ Активировать дополнительные функции на используемых проектах (Строки №32 - 45);
 * 		▻ Если Вы собираетесь использовать кран https://freenem.com/, то необходимо установить любое расширение для блокировки рекламы!
 * 		  Советую установить именно Adblock Plus: https://adblockplus.org/en/
 * 
 *	[ Связь со мной ]: 
 *  	⑴ Почта: multicaptchabot@ya.ru
 *      ⑵ Сайт: https://multicaptchabot.wixsite.com/multicaptchabot
 *	⑶ ruCaptcha.com: https://rucaptcha.com/software/view/freebitcoin-multicaptcha-bot
 */
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// [ Блок №1 ]: Пользовательские настройки
const captchaPath      = 'C:\\MultiCaptcha_bot\\';         // Путь для загрузки текстовых капч (если будете менять путь, НЕ ЗАБУДЬТЕ про двойные слеши)
const logPath 	       = 'C:\\MultiCaptcha_bot\\log.txt';  // Путь для файла с логом (если будете менять путь, НЕ ЗАБУДЬТЕ про двойные слеши)

const apiKey_ruCaptcha = '******************************'; // Ваш API KEY с сервиса ruCaptcha.com (https://rucaptcha.com/enterpage) / 2Captcha.com

// [ Блок №2 ]: Кран https://freebitco.in/
const freeBITCOIN              = 'OFF';  // [ON / OFF] - Активировать бота на проекте https://freebitco.in/
const freeBITCOIN_RewardPoints = 'OFF';  // [ON / OFF] - Авто-использование Reward Points на сайте https://freebitco.in/ (Шаг 4* : https://multicaptchabot.wixsite.com/multicaptchabot/instruction)
const freeBITCOIN_RandomTimer  = 'OFF';  // [ON / OFF] - Случайный таймер от 30 секунд до 2-х минут перед следующим сбором на сайте https://freebitco.in/

// [ Блок №3 ]: Кран https://freedoge.co.in/
const freeDOGECOIN             = 'OFF';  // [ON / OFF] - Активировать бота на проекте https://freedoge.co.in/
const freeDOGECOIN_RandomTimer = 'OFF';  // [ON / OFF] - Случайный таймер от 30 секунд до 2-х минут перед следующим сбором на сайте https://freedoge.co.in/

// [ Блок №4 ]: Кран https://freenem.com/
const freeNEM	               = 'OFF';            // [ON / OFF] - Активировать бота на проекте https://freenem.com/
const freeNEM_Login            = '*************';  // Ваш логин на проекте https://freenem.com/ (Это необходимо, т.к. сайт спустя некоторое время завершает сессию и приходиться авторизироваться снова)
const freeNEM_Password         = '*************';  // Ваш пароль на проекте https://freenem.com/ (Причина аналогична описанной выше)
const freeNEM_RandomTimer      = 'OFF';	           // [ON / OFF] - Случайный таймер от 30 секунд до 2-х минут перед следующим сбором на сайте https://freenem.com/
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/**
 *  @description Решение reCAPTCHA v2 через сервис https://ruCaptcha.com
 *  @since Tue Apr 03 2018 01:38:33 GMT+0300 (MSK)
 *  @author AlexanderFSP<https://github.com/AlexanderFSP>
 *
 *  @function solveReCaptcha_ruCaptcha
 *  @param { String } data_sitekey Ключ сайта
 *  @param { String } pageurl URL страницы, на которой происходит распознавание reCAPTCHA v2
 *  @param { Number } invisble Параметр для запроса, который нужно использовать для решения Invisible reCAPTCHA V2
 *  @returns { JSON } Объект, который содержит информацию об успешном / неудачном запросе к серверу - http://discount.rucaptcha.com / https://rucaptcha.com 
 */
function solveReCaptcha_ruCaptcha(data_sitekey, pageurl, invisble) {
	var serverURL = 'http://discount.rucaptcha.com/';
	while (true) {
		iimPlayCode('SET !TIMEOUT_PAGE 60\nTAB OPEN\nTAB T=2\nURL GOTO=' + serverURL + 'in.php?key=' + apiKey_ruCaptcha + '&method=userrecaptcha&googlekey=' + data_sitekey + '&pageurl=' + pageurl + '&invisible=' + invisble + '&json=1&soft_id=2004');
		var answer = JSON.parse(window.content.document.getElementsByTagName('pre')[0].firstChild.data);
		if (!answer['status']) {
			if (answer['request'] === 'ERROR_NO_SLOT_AVAILABLE') {
				serverURL = 'http://rucaptcha.com/'; // => Меняем сервер на приоритетный, по причине переполненной очереди на discount-сервере...
				continue;
			}
			iimDisplay('[ ' + serverURL + ' ]: Error! Trying to solve again...');
			log(pageurl, 'Ошибка http://rucaptcha.com/ (' + answer['request'] + '). Пытаемся еще раз решить капчу...');
			return { 'status' : 0, 'taskId' : 0, 'hash' : answer['request'], 'server' : serverURL }; // => { status : 0, taskId : 0, hash : ERROR_CODE, server : SERVER_URL }
		}
		var taskId = answer['request'];
		break;
	}

	iimPlayCode('WAIT SECONDS=10');

	var numberOfIterations = 1;
	while (numberOfIterations <= 30) {
		iimPlayCode('SET !TIMEOUT_PAGE 60\nURL GOTO=' + serverURL + 'res.php?key=' + apiKey_ruCaptcha + '&action=get&id=' + taskId + '&json=1');
		answer = JSON.parse(window.content.document.getElementsByTagName('pre')[0].firstChild.data);
		if (answer['status']) {
			iimPlayCode('SET !TIMEOUT_PAGE 30\nTAB CLOSE')
			break;
		} else {
			if (answer['request'] !== 'CAPCHA_NOT_READY') {
				iimDisplay('[ ' + serverURL + ' ]: Error! Trying to solve again...');
				log(pageurl, 'Ошибка http://rucaptcha.com/ (' + answer['request'] + '). Пытаемся еще раз решить капчу...');
				iimPlayCode('SET !TIMEOUT_PAGE 30\nTAB CLOSE')
				return { 'status' : 0, 'taskId' : taskId, 'hash' : answer['request'], 'server' : serverURL }; // => { status : 0, taskId : 0, hash : ERROR_CODE, server : SERVER_URL }
			}

			if (numberOfIterations == 30) {
				iimDisplay('[ ' + serverURL + ' ]: Response time is expired! Trying again...');
				log(pageurl, 'Истекло время ответа! Пробуем еще...');
				iimPlayCode('SET !TIMEOUT_PAGE 30\nTAB CLOSE')
				return { 'status' : 0, 'taskId' : taskId, 'hash' : answer['request'], 'server' : serverURL }; // => { status : 0, taskId : 0, hash : ERROR_CODE, server : SERVER_URL }
			}

			iimDisplay('Iteration number : ' + numberOfIterations);
			iimPlayCode('WAIT SECONDS=5'); // => 10 + 30 * 5 = 160 secs.
			numberOfIterations++;
		}
	}
	return { 'status' : answer['status'], 'taskId' : taskId, 'hash' : answer['request'], 'server' : serverURL };
}

/**
 *  @description Решение текстовой капчи через сервис https://ruCaptcha.com
 *  @since Tue Apr 03 2018 01:48:14 GMT+0300 (MSK)
 *  @author AlexanderFSP<https://github.com/AlexanderFSP>
 *
 *  @function solveTextCaptcha_ruCaptcha
 *  @param { String } pageurl URL страницы, на которой происходит распознавание текстовой капчи
 *  @param { String } captchaName Название изображения с актуальной текстовой капчей
 *  @param { Number } minLen Минимальное количество символов в ответе
 *  @param { Number } maxLen Максимальное количество символов в ответе
 *  @param { String } regsense Чувствительность текстовой капчи к регистру
 *  @returns { JSON } Объект, который содержит информацию об успешном / неудачном запросе к сервису серверу - http://discount.rucaptcha.com / https://rucaptcha.com
 */
function solveTextCaptcha_ruCaptcha(pageurl, captchaName, minLen, maxLen, regsense) {
	iimPlayCode('SET !ERRORIGNORE YES'
			+n+ 'SET !TIMEOUT_PAGE 60'
			+n+ 'SET !TIMEOUT_STEP 10'
			+n+ 'TAB OPEN'
			+n+ 'TAB T=2'
			+n+ 'URL GOTO=http://imacros2.rucaptcha.com/new/'
			+n+ 'TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:getcapcha.php ATTR=NAME:key CONTENT=' + apiKey_ruCaptcha
			+n+ 'TAG POS=1 TYPE=INPUT:FILE FORM=ACTION:getcapcha.php ATTR=NAME:file CONTENT=' + captchaPath + captchaName
			+n+ 'TAG POS=1 TYPE=INPUT:CHECKBOX FORM=ACTION:getcapcha.php ATTR=NAME:get_id CONTENT=YES'
			+n+ 'TAG POS=1 TYPE=INPUT:CHECKBOX FORM=ACTION:getcapcha.php ATTR=NAME:regsense CONTENT=' + regsense
			+n+ 'TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:getcapcha.php ATTR=NAME:min_len CONTENT=' + minLen
			+n+ 'TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:getcapcha.php ATTR=NAME:max_len CONTENT=' + maxLen
			+n+ 'TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:getcapcha.php ATTR=NAME:language CONTENT=2'
			+n+ 'TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:getcapcha.php ATTR=NAME:numeric CONTENT=2'
			+n+ 'TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:getcapcha.php ATTR=NAME:soft_id CONTENT=2004'
			+n+ 'SET !TIMEOUT_PAGE 100'
			+n+ 'TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:getcapcha.php ATTR=*');
	var result = window.content.document.querySelector("body").innerHTML;
	iimPlayCode('SET !TIMEOUT_PAGE 30\nTAB CLOSE');

	if (result.includes('OK'))
		return { 'status' : 1, 'taskId' : result.split('|')[1], 'hash' : result.split('|')[2], 'server' : 'http://rucaptcha.com/' };
	iimDisplay('[ http://rucaptcha.com/ ] : Error! Trying to solve again...');
	log(pageurl, 'Ошибка http://rucaptcha.com/ (' + result + '). Пытаемся еще раз решить капчу...');
	return { 'status' : 0, 'taskId' : 0, 'hash' : result, 'server' : 'http://rucaptcha.com/' }; // => { status : 0, taskId : 0, hash : ERROR_CODE, server : 'http://rucaptcha.com/' }
}

/**
 *  @description Отправка жалоб на неправильные ответы: http://discount.rucaptcha.com / https://rucaptcha.com
 *  @since Tue Apr 03 2018 01:55:26 GMT+0300 (MSK)
 *  @author AlexanderFSP<https://github.com/AlexanderFSP>
 *
 *  @function reportCaptcha
 *  @param { String } serverURL URL сервера, на котором происходило распознавание капчи
 *  @param { String } taskId ID неверно решённой капчи
 */
function reportCaptcha(serverURL, taskId) {
	iimPlayCode('SET !ERRORIGNORE YES'
			+n+ 'SET !TIMEOUT_PAGE 30'
			+n+ 'TAB OPEN'
			+n+ 'TAB T=2'
			+n+ 'URL GOTO=' + serverURL + 'res.php?key=' + apiKey_ruCaptcha + '&action=reportbad&id=' + taskId
			+n+ 'TAB CLOSE');
}

/**
 *  @description Ожидание времени до следующего сбора
 *  @since Tue Apr 03 2018 01:56:13 GMT+0300 (MSK)
 *  @author AlexanderFSP<https://github.com/AlexanderFSP>
 *
 *  @function timeTillNextRoll
 *  @param { String } pageurl URL страницы, на которой был обнаружен таймер (для log.txt)
 *  @param { String } pageurl_RandomTimer Опция 'Случайный таймер'
 *  @param { Number } seconds Время в секундах до следующего сбора
 */
function timeTillNextRoll(pageurl, pageurl_RandomTimer, seconds) {
	if (pageurl_RandomTimer === 'ON')
		seconds += Math.floor(Math.random () * 90 + 20);
	seconds += 10;	// => default waiting

	iimDisplay('Time till next roll: ' + seconds + ' secs.'
		   +n+ 'Earnings during this session:'
		   +n+ '[ freebitco.in ]'
		   +n+ '\t# ' + Winnings_freeBITCOIN.toFixed(8) + ' BTC'
		   +n+ '\t# ' + Rewards_freeBITCOIN + ' Reward Points'
		   +n+ '\t# ' + Tickets_freeBITCOIN + ' Lottery Tickets'
		   +n+ '[ freedoge.co.in ]'
		   +n+ '\t# ' + Winnings_freeDOGECOIN.toFixed(8) + ' DOGE'
		   +n+ '[ freenem.com ]'
		   +n+ '\t# ' + Winnings_freeNEM.toFixed(8) + ' NEM');
	log(pageurl, 'Ожидание ' + seconds + ' до следующего сбора...');
	iimPlayCode('WAIT SECONDS=' + seconds);
}

/**
 *  @description Генерирование случайного названия для файла с текстовой капчей
 *  @since Tue Apr 03 2018 02:01:05 GMT+0300 (MSK)
 *  @author AlexanderFSP<https://github.com/AlexanderFSP>
 *
 *  @function timeTillNextRoll
 *  @returns { String } Название файла с текстовой капчей
 */
function makeUniqueName() {
    var text = 'FreeCrypto_';
    var possible = 'abcdefghijklmnopqrstuvwxyz0123456789';

    for(let i = 0; i <= 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text + '.jpg';
}

/**
 *  @description Запись лога
 *  @since Tue Apr 03 2018 02:03:34 GMT+0300 (MSK)
 *  @author AlexanderFSP<https://github.com/AlexanderFSP>
 *
 *  @function log
 *  @param { String } pageurl URL актуальной страницы
 *  @param { String } message Новая запись о событии
 */
function log(pageurl, message) {
	var text = '[ ' + new window.Date().toLocaleDateString() + ' ' + new window.Date().toLocaleTimeString() + ' ]: (' + pageurl + ') - ' + message + '\r\n';
	var fileDescriptor = imns.FIO.openNode(logPath);
	imns.FIO.appendTextFile(fileDescriptor, text);
}

/**
 *  @description Информирование о неуспешном решение капчи
 *  @since Tue Apr 03 2018 02:05:28 GMT+0300 (MSK)
 *  @author AlexanderFSP<https://github.com/AlexanderFSP>
 *
 *  @function notificationsBadCaptcha
 *  @param { String } pageurl URL актуальной страницы
 */
function notificationsBadCaptcha(pageurl) {
	iimDisplay('Bot didn\'t decide captcha 5 times in a row. Come back a little later...');
	log(pageurl, 'Бот не решил капчу 5 раз подряд. Вернемся чуть позже...');
}

/**
 *  @description Информирование о неполном заполнении исходных данных
 *  @since Tue Apr 03 2018 02:06:46 GMT+0300 (MSK)
 *  @author AlexanderFSP<https://github.com/AlexanderFSP>
 *
 *  @function checkForInattention
 */
function checkForInattention() {
    if ((freeBITCOIN === 'OFF') && (freeDOGECOIN === 'OFF') && (freeNEM === 'OFF')) {
        alert('Перед запуском бота в текстовом файле \"MCB_v510.js\" необходимо выбрать хотя бы один проект, который будет использоваться. Будьте внимательны!\n\nСтрока №33: const freeBITCOIN      = \'OFF\';\nСтрока №38: const freeDOGECOIN = \'OFF\';\nСтрока №42: const freeNEM             = \'OFF\';');
        return true;
    }

    if (apiKey_ruCaptcha === '******************************') {
        alert('Перед запуском бота в текстовом файле \"MCB_v510.js\" необходимо вместо звездочек вставить свой API KEY сервиса ruCaptcha.com (https://rucaptcha.com/enterpage) / 2Captcha.com. Будьте внимательны!\n\nСтрока №30: const apiKey_ruCaptcha = \'*******************\';');
        return true;
    }

	if ((freeNEM === 'ON')&& ((freeNEM_Login === '*************') || (freeNEM_Password === '*************'))) {
		alert('Вы активировали бота на кране https://freenem.com/, но забыли указать Ваши логин и пароль на этом проекте. Будьте внимательны!\n\nconst freeNEM_Login        = \'*************\';\n\nconst freeNEM_Password = \'*************\';');
		return true;
	}

    return false;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
const n = '\n';
var Winnings_freeBITCOIN = 0, Rewards_freeBITCOIN = 0, Tickets_freeBITCOIN = 0, Winnings_freeDOGECOIN = 0, Winnings_freeNEM = 0;

while (true) {
    if (checkForInattention())
        break;

	try {
		while (true) {
			// https://freebitco.in/ - - - - - >
			if (freeBITCOIN === 'ON') {
				freeBitcoinBody : {
					do {
						iimDisplay('Connecting to the https://freebitco.in/...');
						log('freebitco.in', 'Подключение к проекту...');
						iimPlayCode('SET !TIMEOUT_PAGE 30'
								+n+ 'TAB CLOSEALLOTHERS'
								+n+ 'TAB T=1'
								+n+ 'TAB CLOSE'
								+n+ 'URL GOTO=https://freebitco.in/?op=home'
								+n+ 'WAIT SECONDS=8');
						if (!window.content.document.getElementById('free_play_form_button')) {
							iimDisplay('Cloudflare protection is detected...');
							log('freebitco.in', 'Обнаружена cloudflare protection...');
							iimPlayCode('WAIT SECONDS=20');
							continue;
						}
						break;
					} while (!window.content.document.getElementById('free_play_form_button'));

					if (/^(\d+)m:(\d+)s/.exec(window.content.document.getElementsByTagName('title')[0].innerText)) {
						let timer = Number(/^(\d+)m:(\d+)s/.exec(window.content.document.getElementsByTagName('title')[0].innerText)[1]) * 60 + Number(/^(\d+)m:(\d+)s/.exec(window.content.document.getElementsByTagName('title')[0].innerText)[2]);
						timeTillNextRoll('freebitco.in', freeBITCOIN_RandomTimer, timer);
					}

					let solvingCaptchaCycles = 1, answer = null;
					freeBitcoinLabel:
					while (solvingCaptchaCycles <= 5) {
					    do {
							iimDisplay('Refreshing page...');
							log('freebitco.in', 'Обновляем страницу...');
							iimPlayCode('SET !TIMEOUT_PAGE 60'
									+n+ 'TAB CLOSEALLOTHERS'
									+n+ 'TAB T=1'
									+n+ 'TAB CLOSE'
									+n+ 'URL GOTO=https://freebitco.in/?op=home'
									+n+ 'WAIT SECONDS=8');
							if (!window.content.document.getElementById('free_play_form_button')) {
								iimDisplay('Cloudflare protection is detected...');
								log('freebitco.in', 'Обнаружена cloudflare protection...');
								iimPlayCode('WAIT SECONDS=20');
								continue;
							}
							break;
						} while (!window.content.document.getElementById('free_play_form_button'));

                        if (/^(\d+)m:(\d+)s/.exec(window.content.document.getElementsByTagName('title')[0].innerText)) {
                            iimDisplay('There was an exception...');
                            log('freebitco.in', 'Произошел отлов исключительной ситуации...');
                            break;
                        }
	
						if (freeBITCOIN_RewardPoints === 'ON') {
							let accountRewardPoints = Number(window.content.document.getElementsByClassName('user_reward_points')[0].innerHTML.replace(',', ''));
							if (!window.content.document.getElementById('bonus_container_free_points')) {
								if (accountRewardPoints < 12) { }
								else if ((accountRewardPoints >= 12 ) && (accountRewardPoints < 120)) {
									iimDisplay('Activating 1 REWARD POINTS / ROLL...');
									log('freebitco.in', 'Активируем \'1 REWARD POINTS / ROLL\'');
									iimPlayCode('SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 10\nTAG POS=1 TYPE=BUTTON ATTR=ONCLICK:RedeemRPProduct(\'free_points_1\')\nWAIT SECONDS=1');
									accountRewardPoints -= 12;
								}
								else if ((accountRewardPoints >= 120) && (accountRewardPoints < 600)) {
									iimDisplay('Activating 10 REWARD POINTS / ROLL...');
									log('freebitco.in', 'Активируем \'10 REWARD POINTS / ROLL\'');
									iimPlayCode('SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 10\nTAG POS=1 TYPE=BUTTON ATTR=ONCLICK:RedeemRPProduct(\'free_points_10\')\nWAIT SECONDS=1');
									accountRewardPoints -= 120;
								}
								else if ((accountRewardPoints >= 600) && (accountRewardPoints < 1200)) {
									iimDisplay('Activating 50 REWARD POINTS / ROLL...');
									log('freebitco.in', 'Активируем \'50 REWARD POINTS / ROLL\'');
									iimPlayCode('SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 10\nTAG POS=1 TYPE=BUTTON ATTR=ONCLICK:RedeemRPProduct(\'free_points_50\')\nWAIT SECONDS=1');
									accountRewardPoints -= 600;
								}
								else {
									iimDisplay('Activating 100 REWARD POINTS / ROLL...');
									log('freebitco.in', 'Активируем \'100 REWARD POINTS / ROLL\'');
									iimPlayCode('SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 10\nTAG POS=1 TYPE=BUTTON ATTR=ONCLICK:RedeemRPProduct(\'free_points_100\')\nWAIT SECONDS=1');
									accountRewardPoints -= 1200;
								}
							}
	
							if (!window.content.document.getElementById('bonus_container_fp_bonus')) {
								if (accountRewardPoints < 2800) { }
								else if ((accountRewardPoints >= 2800) && (accountRewardPoints < 4400)) {
									iimDisplay('Activating 500% FREE BTC BONUS...');
									log('freebitco.in', 'Активируем \'500% FREE BTC BONUS\'');
									iimPlayCode('SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 10\nTAG POS=1 TYPE=BUTTON ATTR=ONCLICK:RedeemRPProduct(\'fp_bonus_500\')\nWAIT SECONDS=1');
								}
								else
								{
									iimDisplay('Activating 1000% FREE BTC BONUS...');
									log('freebitco.in', 'Активируем \'1000% FREE BTC BONUS\'');
									iimPlayCode('SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 10\nTAG POS=1 TYPE=BUTTON ATTR=ONCLICK:RedeemRPProduct(\'fp_bonus_1000\')\nWAIT SECONDS=1');
								}
							}
						}

						if (window.content.document.getElementsByClassName('cc_banner cc_container cc_container--open').length)
							iimPlayCode('SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 1\nTAG POS=1 TYPE=A ATTR=TXT:Got<SP>it!');

						iimDisplay('Determining type of captcha...');
						log('freebitco.in', 'Определяем тип капчи на странице...');
						window.scrollBy(0, 20000);

						if (window.content.document.getElementById('switch_captchas_button')) {
							iimDisplay('\'SWITCH CAPTCHA BUTTON\' is detected. Choosing double captchas.net. Solving...');
							log('freebitco.in', 'Двойная captchas.net обнаружена. Попытаемся ее решить...');

							let str = (window.content.document.getElementById("switch_captchas_button").onclick + ' ').split('\'')[1].split('\'')[0];
							if (str === 'double_captchas')
								iimPlayCode('SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 10\nEVENT TYPE=CLICK SELECTOR=\'#switch_captchas_button\' BUTTON=0\nWAIT SECONDS=2.5');
				
							let captchasNet = window.content.document.getElementsByClassName('captchasnet_captcha_content');
							for (let i = 1; i <= captchasNet.length; i++) {
								let regsense = (i == 1) ? 'NO' : 'YES';
								let captchaName = makeUniqueName();
								iimPlayCode('SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 10\nONDOWNLOAD FOLDER=' + captchaPath + ' FILE=' + captchaName + ' WAIT=YES\nTAG POS=' + i + ' TYPE=DIV ATTR=CLASS:captchasnet_captcha_content CONTENT=EVENT:SAVE_ELEMENT_SCREENSHOT');
								
								answer = solveTextCaptcha_ruCaptcha('freebitco.in', captchaName, 6, 6, regsense);
								if (!answer['status']) {
									if (solvingCaptchaCycles == 5) {
										notificationsBadCaptcha('freebitco.in');
										break freeBitcoinBody;
									}
									solvingCaptchaCycles++;
									continue freeBitcoinLabel;
								}

								iimPlayCode('SET !ERRORIGNORE YES'
										+n+ 'SET !TIMEOUT_STEP 10'
                                        +n+ 'WAIT SECONDS=2.5'
										+n+ 'TAG POS=' + i + ' TYPE=INPUT:TEXT ATTR=CLASS:captchasnet_captcha_input_box CONTENT=\"' + answer['hash'] + '\"'
										+n+ 'FILEDELETE NAME=' + captchaPath + captchaName);
							}
						} else {
							if (window.content.document.getElementById('g-recaptcha-response')) {
								iimDisplay('reCAPTCHA v2 is detected. Solving...');
								log('freebitco.in', 'reCAPTCHA v2 обнаружена. Попытаемся ее решить...');

								window.content.document.getElementById('g-recaptcha-response').style.display = '';
								iimPlayCode('SET !ERRORIGNORE YES'
										+n+ 'SET !TIMEOUT_STEP 10'
										+n+ 'FRAME F=1'
										+n+ 'TAG POS=1 TYPE=DIV ATTR=ROLE:presentation&&CLASS:recaptcha-checkbox-checkmark&&TXT:'
										+n+ 'WAIT SECONDS=8');

								if (!window.content.document.getElementById('g-recaptcha-response').value.length) {
									let data_sitekey = window.content.document.getElementsByClassName('g-recaptcha')[0].getAttribute('data-sitekey');
									answer = solveReCaptcha_ruCaptcha(data_sitekey, 'freebitco.in', 0);
									if (!answer['status']) {
										if (solvingCaptchaCycles == 5) {
											notificationsBadCaptcha('freebitco.in');
											break;
										}
										solvingCaptchaCycles++;
										continue;
									}
									iimPlayCode('SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 10\nWAIT SECONDS=2.5\nTAG POS=1 TYPE=TEXTAREA FORM=ID:* ATTR=ID:g-recaptcha-response CONTENT=\"' + answer['hash'] + '\"');
								}
							} else if (window.content.document.getElementsByClassName('captchasnet_captcha_content').length) {
								iimDisplay('Captchas.net / Freebitco.in custom captcha is detected. Solving...');
								log('freebitco.in', 'Captchas.net обнаружена. Попытаемся ее решить...');
								
								let captchasNet = window.content.document.getElementsByClassName('captchasnet_captcha_content');
								for (let i = 1; i <= captchasNet.length; i++) {
									let regsense = (i == 1) ? 'NO' : 'YES';
									let captchaName = makeUniqueName();
									iimPlayCode('SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 10\nONDOWNLOAD FOLDER=' + captchaPath + ' FILE=' + captchaName + ' WAIT=YES\nTAG POS=' + i + ' TYPE=DIV ATTR=CLASS:captchasnet_captcha_content CONTENT=EVENT:SAVE_ELEMENT_SCREENSHOT');
									
									answer = solveTextCaptcha_ruCaptcha('freebitco.in', captchaName, 6, 6, regsense);
									if (!answer['status']) {
										if (solvingCaptchaCycles == 5) {
											notificationsBadCaptcha('freebitco.in');
											break freeBitcoinBody;
										}
										solvingCaptchaCycles++;
										continue freeBitcoinLabel;
									}

									iimPlayCode('SET !ERRORIGNORE YES'
											+n+ 'SET !TIMEOUT_STEP 10'
											+n+ 'WAIT SECONDS=2.5'
											+n+ 'TAG POS=' + i + ' TYPE=INPUT:TEXT ATTR=CLASS:captchasnet_captcha_input_box CONTENT=\"' + answer['hash'] + '\"'
											+n+ 'FILEDELETE NAME=' + captchaPath + captchaName);
								}
							} else if (window.content.document.getElementById('adcopy-puzzle-image')) {
								iimDisplay('Solvemedia is detected. Solving...');
								log('freebitco.in', 'Solvemedia обнаружена. Попытаемся ее решить...');

								let solveMedia = window.content.document.getElementById('adcopy-puzzle-image');
								let captchaName = makeUniqueName();
								iimPlayCode('SET !ERRORIGNORE YES'
										+n+ 'SET !TIMEOUT_STEP 10'
										+n+ 'TAG POS=1 TYPE=IMG ATTR=SRC:https://api-secure.solvemedia.com/media/reload-whV2.gif'
										+n+ 'WAIT SECONDS=10'
										+n+ 'ONDOWNLOAD FOLDER=' + captchaPath + ' FILE=' + captchaName + ' WAIT=YES'
										+n+ 'TAG POS=1 TYPE=DIV ATTR=ID:adcopy-puzzle-image CONTENT=EVENT:SAVE_ELEMENT_SCREENSHOT');
								
								answer = solveTextCaptcha_ruCaptcha('freebitco.in', captchaName, 0, 0, 'NO');
								if (!answer['status']) {
									if (solvingCaptchaCycles == 5) {
										notificationsBadCaptcha('freebitco.in');
										break;
									}
									solvingCaptchaCycles++;
									continue;
								}

                                iimPlayCode('SET !ERRORIGNORE YES'
                                        +n+ 'SET !TIMEOUT_PAGE 30'
										+n+ 'SET !TIMEOUT_STEP 10'
										+n+ 'WAIT SECONDS=2.5'
										+n+ 'TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:adcopy_response CONTENT=\"' + answer['hash']  + '\"'
										+n+ 'FILEDELETE NAME=' + captchaPath + captchaName);
							}
						}

						iimDisplay('Claiming satoshis...');
						log('freebitco.in', 'Собираем сатоши...');
						iimPlayCode('SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 10\nTAG POS=1 TYPE=INPUT:SUBMIT ATTR=ID:free_play_form_button\nWAIT SECONDS=8');

						if (Number(window.content.document.getElementById('winnings').innerHTML) > 0) {
							iimDisplay('Successfully claimed!');
							log('freebitco.in', 'Успешный сбор! Собрано: ' + Number(window.content.document.getElementById('winnings').innerHTML) + ' BTC; ' + Number(window.content.document.getElementById('fp_reward_points_won').innerHTML) + ' Reward Points; ' + Number(window.content.document.getElementById('fp_lottery_tickets_won').innerHTML) + ' Lottery Tickets');
							Winnings_freeBITCOIN += Number(window.content.document.getElementById('winnings').innerHTML);
							Rewards_freeBITCOIN  += Number(window.content.document.getElementById('fp_reward_points_won').innerHTML);
							Tickets_freeBITCOIN  += Number(window.content.document.getElementById('fp_lottery_tickets_won').innerHTML);
							break;
						} else {
							if ((window.content.document.getElementById('free_play_error').style.display !== 'none') && (window.content.document.getElementById('free_play_error').innerText.includes('verify'))) {
								iimDisplay('Email verification is detected...');
								log('freebitco.in', 'Необходимо подтвердить email, чтобы продолжить сбор!');
								break;
							} else if ((window.content.document.getElementById('free_play_error').style.display !== 'none') && (window.content.document.getElementById('free_play_error').innerText.includes('blocked'))) {
								iimDisplay('Account of the https://freebitco.in/ has been banned...');
								log('freebitco.in', 'Аккаунт забанен!');
								break;
							} else {
								iimDisplay('Captcha was solved incorrectly. Sending a report and trying to solve captcha again...');
								log('freebitco.in', 'Капча была решена неверно. Отправляем жалобу и пытаемся решить еще раз...');
								reportCaptcha(answer['server'], answer['taskId']);
								
								if (solvingCaptchaCycles == 5) {
									notificationsBadCaptcha('freebitco.in');
									break;
								}
								solvingCaptchaCycles++;
								continue;
							}
						}
					}
				}
			}

			// https://freedoge.co.in/ - - - - - >
			if (freeDOGECOIN === 'ON') {
                do {
                    iimDisplay('Connecting to the https://freedoge.co.in/...');
                    log('freedoge.co.in', 'Подключение к проекту...');
                    iimPlayCode('SET !TIMEOUT_PAGE 30'
                            +n+ 'TAB CLOSEALLOTHERS'
                            +n+ 'TAB T=1'
                            +n+ 'TAB CLOSE'
                            +n+ 'URL GOTO=https://freedoge.co.in/'
                            +n+ 'WAIT SECONDS=8');

                    if (!window.content.document.getElementById('free_play_form_button')) {
                        iimDisplay('Cloudflare protection is detected...');
                        log('freedoge.co.in', 'Обнаружена cloudflare protection...');
                        iimPlayCode('WAIT SECONDS=20');
                        continue;
                    }
                    break;
                } while (!window.content.document.getElementById('free_play_form_button'));

                if (/^(\d+)m:(\d+)s/.exec(window.content.document.getElementsByTagName('title')[0].innerText)) {
                    let timer = Number(/^(\d+)m:(\d+)s/.exec(window.content.document.getElementsByTagName('title')[0].innerText)[1]) * 60 + Number(/^(\d+)m:(\d+)s/.exec(window.content.document.getElementsByTagName('title')[0].innerText)[2]);
                    timeTillNextRoll('freedoge.co.in', freeDOGECOIN_RandomTimer, timer);
                }
                
                let solvingCaptchaCycles = 1;
                while (solvingCaptchaCycles <= 5) {
					do {
						iimDisplay('Refreshing page...');
						log('freedoge.co.in', 'Обновляем страницу...');
						iimPlayCode('SET !TIMEOUT_PAGE 60'
								+n+ 'TAB CLOSEALLOTHERS'
								+n+ 'TAB T=1'
								+n+ 'TAB CLOSE'
								+n+ 'URL GOTO=https://freedoge.co.in/'
								+n+ 'WAIT SECONDS=8');
						if (!window.content.document.getElementById('free_play_form_button')) {
							iimDisplay('Cloudflare protection is detected...');
							log('freedoge.co.in', 'Обнаружена cloudflare protection...');
							iimPlayCode('WAIT SECONDS=20');
							continue;
						}
						break;
					} while (!window.content.document.getElementById('free_play_form_button'));

                    if (/^(\d+)m:(\d+)s/.exec(window.content.document.getElementsByTagName('title')[0].innerText)) {
                        iimDisplay('There was an exception...');
                        log('freedoge.co.in', 'Произошел отлов исключительной ситуации...');
                        break;
					}
					
					if (window.content.document.getElementById('free_play_captcha_types').value === 'solvemedia') {
						iimDisplay('Selecting reCAPTCHA v2...');
						log('freedoge.co.in', 'Выбираем reCAPTCHA v2...');
						iimPlayCode('SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 10\nTAG POS=1 TYPE=SELECT ATTR=ID:free_play_captcha_types CONTENT=%recaptcha_v2\nWAIT SECONDS=2');
					}
	
					if (window.content.document.getElementsByClassName('cc_banner cc_container cc_container--open').length)
						iimPlayCode('SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 1\nTAG POS=1 TYPE=A ATTR=TXT:Got<SP>it!');

                    iimDisplay('reCAPTCHA v2 is detected. Solving...');
					log('freedoge.co.in', 'reCAPTCHA v2 обнаружена. Попытаемся ее решить...');
                    window.scrollBy(0, 20000);
                        
					window.content.document.getElementById('g-recaptcha-response').style.display = '';
					iimPlayCode('SET !ERRORIGNORE YES'
							+n+ 'SET !TIMEOUT_STEP 10'
							+n+ 'FRAME F=1'
							+n+ 'TAG POS=1 TYPE=DIV ATTR=ROLE:presentation&&CLASS:recaptcha-checkbox-checkmark&&TXT:'
							+n+ 'WAIT SECONDS=8');

					if (!window.content.document.getElementById('g-recaptcha-response').value.length) {
						var data_sitekey = window.content.document.getElementsByClassName('g-recaptcha')[0].getAttribute('data-sitekey');
						var answer = solveReCaptcha_ruCaptcha(data_sitekey, 'freedoge.co.in', 0);
						if (!answer['status']) {
							if (solvingCaptchaCycles == 5) {
								notificationsBadCaptcha('freedoge.co.in');
								break;
							}
							solvingCaptchaCycles++;
							continue;
						}
						iimPlayCode('SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 10\nWAIT SECONDS=2.5\nTAG POS=1 TYPE=TEXTAREA FORM=ID:* ATTR=ID:g-recaptcha-response CONTENT=\"' + answer['hash'] + '\"');
					}

					iimDisplay('Claiming dogetoshis...');
					log('freedoge.co.in', 'Собираем догитоши...');
					iimPlayCode('SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 10\nTAG POS=1 TYPE=INPUT:SUBMIT ATTR=ID:free_play_form_button\nWAIT SECONDS=8');

					if (Number(window.content.document.getElementById('winnings').innerHTML) > 0) {
						iimDisplay('Successfully claimed!');
						log('freedoge.co.in', 'Успешный сбор! Собрано: ' + Number(window.content.document.getElementById("winnings").innerHTML) + ' DOGE ');
						Winnings_freeDOGECOIN += Number(window.content.document.getElementById('winnings').innerHTML);
						break;
					} else {
						iimDisplay('Unsuccessfully claimed!');
						if ((window.content.document.getElementById('free_play_error').style.display !== 'none') && (window.content.document.getElementById('free_play_error').innerText.includes('verify'))) {
							iimDisplay('Email verification is detected...');
							log('freedoge.co.in', 'Необходимо подтвердить email, чтобы продолжить сбор!');
							break;
						} else if ((window.content.document.getElementById('free_play_error').style.display !== 'none') && (window.content.document.getElementById('free_play_error').innerText.includes('blocked'))) {
							iimDisplay('Account of the https://freedoge.co.in/ has been banned...');
							log('freedoge.co.in', 'Аккаунт забанен!');
							break;
						} else {
							iimDisplay('Captcha was solved incorrectly. Sending a report and trying to solve captcha again...');
							log('freedoge.co.in', 'Капча была решена неверно. Отправляем жалобу и пытаемся решить еще раз...');
							reportCaptcha(answer['server'], answer['taskId']);
							
							if (solvingCaptchaCycles == 5) {
								notificationsBadCaptcha('freedoge.co.in');
								break;
							}
							solvingCaptchaCycles++;
							continue;
						}
					}
				}
			}

			// https://freenem.com/ - - - - - >
			if (freeNEM === 'ON') {
				freeNemBody : {
					let authorizationCycles = 1;
					while (authorizationCycles <= 5) {
						iimDisplay('Connecting to the https://freenem.com/...');
						log('freenem.com', 'Подключение к проекту...');
						iimPlayCode('SET !TIMEOUT_PAGE 60'
								+n+ 'TAB T=1'
								+n+ 'TAB CLOSEALLOTHERS'
								+n+ 'URL GOTO=https://freenem.com/free'
								+n+ 'WAIT SECONDS=8');

						if (!window.content.document.getElementsByClassName('main-button-2 roll-button').length) {
							iimDisplay('Logging to the https://freenem.com/...');
							log('freenem.com', 'Авторизируемся на проекте...');
							iimPlayCode('SET !ERRORIGNORE YES'
									+n+ 'SET !TIMEOUT_PAGE 30'
									+n+ 'SET !TIMEOUT_STEP 10'
									+n+ 'TAG POS=1 TYPE=INPUT:EMAIL ATTR=NAME:email CONTENT=' + freeNEM_Login
									+n+ 'SET !ENCRYPTION NO'
									+n+ 'TAG POS=1 TYPE=INPUT:PASSWORD ATTR=NAME:password CONTENT=' + freeNEM_Password
									+n+ 'TAG POS=1 TYPE=BUTTON ATTR=TXT:LOGIN!'
									+n+ 'WAIT SECONDS=6');
							
							if (!window.content.document.getElementsByClassName('main-button-2 roll-button').length) {
								let data_sitekey = window.content.document.getElementsByTagName('iframe')[0].src.split('?k=')[1].split('&co=')[0];
								let answer = solveReCaptcha_ruCaptcha(data_sitekey, 'freenem.com', 1);
								if (!answer['status']) {
									if (authorizationCycles == 5) {
										notificationsBadCaptcha('freenem.com');
										break freeNemBody;
									}
									authorizationCycles++;
									continue;
								}

								iimPlayCode('SET !ERRORIGNORE YES'
										+n+ 'SET !TIMEOUT_PAGE 30'
										+n+ 'SET !TIMEOUT_STEP 10'
										+n+ 'TAG POS=1 TYPE=TEXTAREA FORM=ID:* ATTR=ID:g-recaptcha-response CONTENT=\"' + answer['hash'] + '\"'
										+n+ 'WAIT SECONDS=6');

								 if (!window.content.document.getElementsByClassName('main-button-2 roll-button').length) {
										iimDisplay('Captcha was solved incorrectly. Sending a report and trying to solve captcha again...');
										log('freenem.com', 'Капча была решена неверно. Отправляем жалобу и пытаемся решить еще раз...');
										reportCaptcha(answer['server'], answer['taskId']);
										
										if (authorizationCycles == 5) {
											notificationsBadCaptcha('freenem.com');
											break freeNemBody;
										}
										authorizationCycles++;
										continue;
								}
								iimDisplay('Successful authorization...');
								log('freenem.com', 'Успешная авторизация...');
								break;
							}
						}
						break;
					}

					let timer = Number(window.content.document.getElementsByClassName('digits')[0].innerHTML * 60) + Number(window.content.document.getElementsByClassName('digits')[1].innerHTML);
					if (timer > 0)
						timeTillNextRoll('freenem.com', freeNEM_RandomTimer, timer);

					let solvingCaptchaCycles = 1;
					while (solvingCaptchaCycles <= 5) {
						iimDisplay('Refreshing page and solving reCAPTCHA v2...');
						log('freenem.com', 'Обновляем страницу и пытаемся решить Invisible reCAPTCHA v2...');
						iimPlayCode('SET !ERRORIGNORE YES'
								+n+ 'SET !TIMEOUT_PAGE 60'
								+n+ 'SET !TIMEOUT_STEP 10'
								+n+ 'TAB CLOSEALLOTHERS'
								+n+ 'TAB T=1'
								+n+ 'TAB CLOSE'
								+n+ 'URL GOTO=https://freenem.com/free'
                                +n+ 'WAIT SECONDS=8');
                                
                        timer = Number(window.content.document.getElementsByClassName('digits')[0].innerHTML * 60) + Number(window.content.document.getElementsByClassName('digits')[1].innerHTML);
                        if (timer > 0) {
							iimDisplay('There was an exception...');
							log('freenem.com', 'Произошел отлов исключительной ситуации...');
                            break freeNemBody;
                        }

                        iimPlayCode('SET !ERRORIGNORE YES'
                                +n+ 'SET !TIMEOUT_PAGE 60'
                                +n+ 'SET !TIMEOUT_STEP 10'
                                +n+ 'TAG POS=1 TYPE=BUTTON ATTR=TXT:ROLL!'
                                +n+ 'WAIT SECONDS=2');

						let data_sitekey = window.content.document.getElementsByTagName('iframe')[0].src.split('?k=')[1].split('&co=')[0];
						let answer = solveReCaptcha_ruCaptcha(data_sitekey, 'freenem.com', 1);

						// - - - Не спрашивайте почему - - - >
						let winningDuringLastSession = Number(window.content.document.getElementsByClassName('result')[0].innerHTML.split(' ')[3]);
						if (!isNaN(winningDuringLastSession) || (winningDuringLastSession > 0)) {
							iimDisplay('Successfully claimed!');
							log('freenem.com', 'Успешный сбор! Собрано: ' + winningDuringLastSession + ' NEM');
							Winnings_freeNEM += winningDuringLastSession;
							break;
						}
						// < - - - Так надо ;) - - - 

						if (!answer['status']) {
							if (solvingCaptchaCycles == 5) {
								notificationsBadCaptcha('freenem.com');
								break;
							}
							solvingCaptchaCycles++;
							continue;
						}

						iimDisplay('Claiming NEM...');
						log('freenem.com', 'Собираем NEM...');

						iimPlayCode('SET !ERRORIGNORE YES'
								+n+ 'SET !TIMEOUT_PAGE 30'
								+n+ 'SET !TIMEOUT_STEP 10'
								+n+ 'WAIT SECONDS=2.5'
								+n+ 'TAG POS=1 TYPE=TEXTAREA FORM=ID:* ATTR=ID:g-recaptcha-response CONTENT=\"' + answer['hash'] + '\"'
								+n+ 'ONDIALOG POS=1 BUTTON=OK CONTENT='
								+n+ 'WAIT SECONDS=8');
							
						winningDuringLastSession = Number(window.content.document.getElementsByClassName('result')[0].innerHTML.split(' ')[3]);
						if (!isNaN(winningDuringLastSession) || (winningDuringLastSession > 0)) {
							iimDisplay('Successfully claimed!');
							log('freenem.com', 'Успешный сбор! Собрано: ' + winningDuringLastSession + ' NEM');
							Winnings_freeNEM += winningDuringLastSession;
							break;
						} else {
							iimDisplay('Captcha was solved incorrectly. Sending a report and trying to solve captcha again...');
							log('freenem.com', 'Капча была решена неверно. Отправляем жалобу и пытаемся решить еще раз...');
							reportCaptcha(answer['server'], answer['taskId']);

							if (solvingCaptchaCycles == 5) {
								notificationsBadCaptcha('freenem.com');
								break;
							}
							solvingCaptchaCycles++;
							continue;
						}
					}
				}
            }
		}
	}
	catch (e) {
	 	log('RESTART', 'Произошла ошибка в работе бота, проверьте подключение к интернету! Бот будет перезапущен через 30 секунд...');
	 	iimDisplay('There was an error in the bot operation, check the connection to the Internet! The bot will be restarted in 30 seconds...');
	}
}
