/**
 *  @description freebitco.in / freedoge.co.in / freenem.com [ MultiCaptchaBot]
 *  @since Wed Apr 11 2018 20:29:02 GMT+0300 (MSK)
 *  @version 5.1.0 (EN)
 *  @tutorial https://multicaptchabot.wixsite.com/multicaptchabot/instruction
 *  @author AlexanderFSP <https://github.com/AlexanderFSP>
 *
 *  [ Instruction ]:
 * 	⑴ Download Mozilla Firefox, iMacros v8.9.7 and configure them according to README.md: https://github.com/AlexanderFSP/MultiCaptchaBot/blob/master/README.md
 *   	⑵ Sign in for sites which you are going to use bot for
 *   	⑶ Register and add funds to your captcha recognition service account using any payment method you prefer
 *   	⑷ Attention, don't forget to do the following actions:
 *      	▻ Create folder C:\MultiCaptcha_bot
 *       	▻ Place your API KEY from ruCaptcha.com / 2Captcha.com instead of asterisks (Line №29)
 *       	▻ Activate faucets you need and additional functions for them (Lines №31 - 44)
 * 		▻ In order to use freenem.com you will need to install any extension to block ads. I suggest installing Adblock Plus
 * 		Download link: https://adblockplus.org/en/
 * 
 *  [ Сontact with me ]: 
 *  	⑴ E-mail: multicaptchabot@ya.ru
 *      ⑵ Website: https://multicaptchabot.wixsite.com/multicaptchabot
 *	⑶ ruCaptcha.com: https://rucaptcha.com/software/view/freebitcoin-multicaptcha-bot
 */
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// [ Block №1 ]: User settings
const captchaPath      = 'C:\\MultiCaptcha_bot\\';         // Text captchas download path (Don't forget to use double backslashes)
const logPath 	       = 'C:\\MultiCaptcha_bot\\log.txt';  // Full log filename (Don't forget to use double backslashes)

const apiKey           = '******************************'; // Your ruCaptcha.com / 2Captcha.com API-KEY

// [ Block №2 ]: https://freebitco.in/
const freeBITCOIN              = 'OFF';  // [ON / OFF] - Use bot on https://freebitco.in/
const freeBITCOIN_RewardPoints = 'OFF';  // [ON / OFF] - Auto-apply Reward Points on https://freebitco.in/ (Full algorithm can be found here: https://github.com/AlexanderFSP/MultiCaptchaBot)
const freeBITCOIN_RandomTimer  = 'OFF';  // [ON / OFF] - Random delay for from 30 seconds to 2 minutes before next roll on https://freebitco.in/

// [ Block №3 ]: https://freedoge.co.in/
const freeDOGECOIN             = 'OFF';  // [ON / OFF] - Use bot on https://freedoge.co.in/
const freeDOGECOIN_RandomTimer = 'OFF';  // [ON / OFF] - Random delay for from 30 seconds to 2 minutes before next roll on https://freedoge.co.in/

// [ Block №4 ]: https://freenem.com/
const freeNEM	               = 'OFF';            // [ON / OFF] - Use bot on https://freenem.com/
const freeNEM_Login            = '*************';  // Login (Required, because session is valid for 3 hours only)
const freeNEM_Password         = '*************';  // Password (For the same reason)
const freeNEM_RandomTimer      = 'OFF';	           // [ON / OFF] - Random delay for from 30 seconds to 2 minutes before next roll on https://freenem.com/
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/**
 *  @description Solving reCAPTCHA v2 via https://ruCaptcha.com (http://discount.ruCaptcha.com) / http://2Captcha.com (http://discount.2Captcha.com)
 *  @since Wed Apr 11 2018 21:08:55 GMT+0300 (MSK)
 *  @author AlexanderFSP <https://github.com/AlexanderFSP>
 *
 *  @function solveReCaptcha_ruCaptcha
 *  @param { String } data_sitekey Site key
 *  @param { String } pageurl URL of the page on which reCAPTCHA v2 is recognized
 *  @param { Number } invisble Request parametr needed to solve Invisible reCAPTCHA V2
 *  @returns { JSON } An object that contains information about a successful / unsuccessful request to the server - https://ruCaptcha.com (http://discount.ruCaptcha.com) / http://2Captcha.com (http://discount.2Captcha.com)
 */
function solveReCaptcha_ruCaptcha(data_sitekey, pageurl, invisble) {
	var serverURL = 'http://discount.rucaptcha.com/';
	while (true) {
		iimPlayCode('SET !TIMEOUT_PAGE 60\nTAB OPEN\nTAB T=2\nURL GOTO=' + serverURL + 'in.php?key=' + apiKey + '&method=userrecaptcha&googlekey=' + data_sitekey + '&pageurl=' + pageurl + '&invisible=' + invisble + '&json=1&soft_id=2004');
		var answer = JSON.parse(window.content.document.getElementsByTagName('pre')[0].firstChild.data);
		if (!answer['status']) {
			if (answer['request'] === 'ERROR_NO_SLOT_AVAILABLE') {
                		iimDisplay('[ ' + serverURL + ' ]: Error! Trying to solve again...');
                		log(pageurl, 'Error ' + serverURL + ' (' + answer['request'] + '). Changing priority of server and trying to solve again...');
                		serverURL = 'http://rucaptcha.com/'; // => Changing priority of server...
                		iimPlayCode('SET !TIMEOUT_PAGE 30\nTAB CLOSE')
				continue;
			}
			iimDisplay('[ ' + serverURL + ' ]: Error! Trying to solve again...');
			log(pageurl, 'Error ' + serverURL + ' (' + answer['request'] + '). Trying to solve again...');
			iimPlayCode('SET !TIMEOUT_PAGE 30\nTAB CLOSE')
			return { 'status' : 0, 'taskId' : 0, 'hash' : answer['request'], 'server' : serverURL }; // => { status : 0, taskId : 0, hash : ERROR_CODE, server : SERVER_URL }
		}
		var taskId = answer['request'];
		break;
	}

	iimPlayCode('WAIT SECONDS=10');

	var numberOfIterations = 1;
	while (numberOfIterations <= 30) {
		iimPlayCode('SET !TIMEOUT_PAGE 60\nURL GOTO=' + serverURL + 'res.php?key=' + apiKey + '&action=get&id=' + taskId + '&json=1');
		answer = JSON.parse(window.content.document.getElementsByTagName('pre')[0].firstChild.data);
		if (answer['status']) {
			iimPlayCode('SET !TIMEOUT_PAGE 30\nTAB CLOSE')
			break;
		} else {
			if (answer['request'] !== 'CAPCHA_NOT_READY') {
				iimDisplay('[ ' + serverURL + ' ]: Error! Trying to solve again...');
				log(pageurl, 'Error ' + serverURL + ' (' + answer['request'] + '). Trying to solve again...');
				iimPlayCode('SET !TIMEOUT_PAGE 30\nTAB CLOSE')
				return { 'status' : 0, 'taskId' : taskId, 'hash' : answer['request'], 'server' : serverURL }; // => { status : 0, taskId : 0, hash : ERROR_CODE, server : SERVER_URL }
			}

			if (numberOfIterations == 30) {
				iimDisplay('[ ' + serverURL + ' ]: Response time is expired! Trying to solve again...');
				log(pageurl, 'Response time is expired! Trying again...');
				iimPlayCode('SET !TIMEOUT_PAGE 30\nTAB CLOSE')
				return { 'status' : 0, 'taskId' : taskId, 'hash' : answer['request'], 'server' : serverURL }; // => { status : 0, taskId : 0, hash : 'CAPCHA_NOT_READY', server : SERVER_URL }
			}

			iimDisplay('Iteration number : ' + numberOfIterations);
			iimPlayCode('WAIT SECONDS=5'); // => 10 + 30 * 5 = 160 secs.
			numberOfIterations++;
		}
	}
	return { 'status' : answer['status'], 'taskId' : taskId, 'hash' : answer['request'], 'server' : serverURL };
}

/**
 *  @description Solving text captchas via https://ruCaptcha.com / http://2Captcha.com
 *  @since Wed Apr 11 2018 21:35:20 GMT+0300 (MSK)
 *  @author AlexanderFSP <https://github.com/AlexanderFSP>
 *
 *  @function solveTextCaptcha_ruCaptcha
 *  @param { String } pageurl URL of the page on which text captcha is recognized
 *  @param { String } captchaName The name of image with captcha
 *  @param { Number } minLen Minimum number of characters in the response
 *  @param { Number } maxLen Maximum number of characters in the response
 *  @param { String } regsense Case sensitivity
 *  @returns { JSON } An object that contains information about a successful / unsuccessful request to the server - http://ruCaptcha.com / http://2Captcha.com
 */
function solveTextCaptcha_ruCaptcha(pageurl, captchaName, minLen, maxLen, regsense) {
	iimPlayCode('SET !ERRORIGNORE YES'
		+n+ 'SET !TIMEOUT_PAGE 60'
		+n+ 'SET !TIMEOUT_STEP 10'
		+n+ 'TAB OPEN'
		+n+ 'TAB T=2'
		+n+ 'URL GOTO=http://imacros2.rucaptcha.com/new/'
		+n+ 'TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:getcapcha.php ATTR=NAME:key CONTENT=' + apiKey
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
	var result = window.content.document.querySelector('body').innerHTML;
	iimPlayCode('SET !TIMEOUT_PAGE 30\nTAB CLOSE');

	if (result.includes('OK'))
		return { 'status' : 1, 'taskId' : result.split('|')[1], 'hash' : result.split('|')[2], 'server' : 'http://rucaptcha.com/' };
	iimDisplay('[ http://rucaptcha.com/ ] : Error! Trying to solve again...');
	log(pageurl, 'Error http://rucaptcha.com/ (' + result + '). Trying to solve again...');
	return { 'status' : 0, 'taskId' : 0, 'hash' : result, 'server' : 'http://rucaptcha.com/' }; // => { status : 0, taskId : 0, hash : ERROR_CODE, server : 'http://rucaptcha.com/' }
}

/**
 *  @description Sending reports to wrong answers from http://discount.rucaptcha.com / https://rucaptcha.com
 *  @since Wed Apr 11 2018 21:38:46 GMT+0300 (MSK)
 *  @author AlexanderFSP <https://github.com/AlexanderFSP>
 *
 *  @function reportCaptcha
 *  @param { String } serverURL URL of captcha recognition server
 *  @param { String } taskId ID of the incorrectly resolved captcha
 */
function reportCaptcha(serverURL, taskId) {
	iimPlayCode('SET !ERRORIGNORE YES'
		+n+ 'SET !TIMEOUT_PAGE 30'
		+n+ 'TAB OPEN'
		+n+ 'TAB T=2'
		+n+ 'URL GOTO=' + serverURL + 'res.php?key=' + apiKey + '&action=reportbad&id=' + taskId
		+n+ 'TAB CLOSE');
}

/**
 *  @description Waiting until the next gathering
 *  @since Wed Apr 11 2018 21:41:17 GMT+0300 (MSK)
 *  @author AlexanderFSP <https://github.com/AlexanderFSP>
 *
 *  @function timeTillNextRoll
 *  @param { String } pageurl URL of the page on which the timer was detected (for log.txt)
 *  @param { String } pageurl_RandomTimer Random delay
 *  @param { Number } seconds Time till next roll in seconds
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
	log(pageurl, 'Waiting ' + seconds + ' till next roll...');
	iimPlayCode('WAIT SECONDS=' + seconds);
}

/**
 *  @description Generating a random name for the text file with text captcha
 *  @since Wed Apr 11 2018 21:42:00 GMT+0300 (MSK)
 *  @author AlexanderFSP <https://github.com/AlexanderFSP>
 *
 *  @function timeTillNextRoll
 *  @returns { String } The name of image with captcha
 */
function makeUniqueName() {
    var text = 'FreeCrypto_';
    var possible = 'abcdefghijklmnopqrstuvwxyz0123456789';

    for(let i = 0; i <= 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text + '.jpg';
}

/**
 *  @description Logging
 *  @since Wed Apr 11 2018 21:43:38 GMT+0300 (MSK)
 *  @author AlexanderFSP <https://github.com/AlexanderFSP>
 *
 *  @function log
 *  @param { String } pageurl URL of the page
 *  @param { String } message New record
 */
function log(pageurl, message) {
	var text = '[ ' + new window.Date().toLocaleDateString() + ' ' + new window.Date().toLocaleTimeString() + ' ]: (' + pageurl + ') - ' + message + '\r\n';
	var fileDescriptor = imns.FIO.openNode(logPath);
	imns.FIO.appendTextFile(fileDescriptor, text);
}

/**
 *  @description Informing about the unsuccessful captcha solution
 *  @since Wed Apr 11 2018 21:44:27 GMT+0300 (MSK)
 *  @author AlexanderFSP <https://github.com/AlexanderFSP>
 *
 *  @function notificationsBadCaptcha
 *  @param { String } pageurl URL of the page
 */
function notificationsBadCaptcha(pageurl) {
	iimDisplay('Bot didn\'t decide captcha 5 times in a row. Come back a little later...');
	log(pageurl, 'Bot didn\'t decide captcha 5 times in a row. Come back a little later...');
}

/**
 *  @description Informing of incomplete filling of initial data
 *  @since Wed Apr 11 2018 21:45:44 GMT+0300 (MSK)
 *  @author AlexanderFSP <https://github.com/AlexanderFSP>
 *
 *  @function checkForInattention
 *  @returns { Boolean } A flag indicating the incorrect filling of the initial data
 */
function checkForInattention() {
    if ((freeBITCOIN === 'OFF') && (freeDOGECOIN === 'OFF') && (freeNEM === 'OFF')) {
        alert('Before starting the bot in the text file \"MCB_v510(EN).js\" you must select at least one project to be used. Be careful!\n\nLine №32: const freeBITCOIN      = \'OFF\';\nLine №37: const freeDOGECOIN = \'OFF\';\nLine №41: const freeNEM             = \'OFF\';');
        return true;
    }

    if (apiKey === '******************************') {
        alert('Before starting the bot in the text file \"MCB_v510(EN).js\" you must place your API KEY from ruCaptcha.com / 2Captcha.com instead of asterisks. Be careful!\n\nLine №29: const apiKey = \'******************************\';');
        return true;
    }
    
    if ((freeNEM === 'ON') && ((freeNEM_Login === '*************') || (freeNEM_Password === '*************'))) {
	alert('You activated the bot on https://freenem.com/, but forgot to enter your login and password on this project. Be careful!\n\nLine №42: const freeNEM_Login        = \'*************\';\n\nLine №43: const freeNEM_Password = \'*************\';');
	return true;
    }

    return false;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
const n = '\n';
var Winnings_freeBITCOIN = 0, Rewards_freeBITCOIN = 0, Tickets_freeBITCOIN = 0, Winnings_freeDOGECOIN = 0, Winnings_freeNEM = 0;

while (true) {
    if (checkForInattention())  break;

	try {
		while (true) {
			// https://freebitco.in/ - - - - - >
			if (freeBITCOIN === 'ON') {
				freeBitcoinBody : {
					do {
						iimDisplay('Connecting to the https://freebitco.in/...');
						log('freebitco.in', 'Connecting to the site...');
						iimPlayCode('SET !TIMEOUT_PAGE 30'
							+n+ 'TAB CLOSEALLOTHERS'
							+n+ 'TAB T=1'
							+n+ 'TAB CLOSE'
							+n+ 'URL GOTO=https://freebitco.in/?op=home'
							+n+ 'WAIT SECONDS=8');
						if (!window.content.document.getElementById('free_play_form_button')) {
							iimDisplay('Cloudflare protection is detected...');
							log('freebitco.in', 'Cloudflare protection is detected...');
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
							log('freebitco.in', 'Refreshing page...');
							iimPlayCode('SET !TIMEOUT_PAGE 60'
								+n+ 'TAB CLOSEALLOTHERS'
								+n+ 'TAB T=1'
								+n+ 'TAB CLOSE'
								+n+ 'URL GOTO=https://freebitco.in/?op=home'
								+n+ 'WAIT SECONDS=8');
							if (!window.content.document.getElementById('free_play_form_button')) {
								iimDisplay('Cloudflare protection is detected...');
								log('freebitco.in', 'Cloudflare protection is detected...');
								iimPlayCode('WAIT SECONDS=20');
								continue;
							}
							break;
					   	} while (!window.content.document.getElementById('free_play_form_button'));
	
						if (/^(\d+)m:(\d+)s/.exec(window.content.document.getElementsByTagName('title')[0].innerText)) {
							iimDisplay('There was an exception...');
                            				log('freebitco.in', 'There was an exception...');
                            				break;
                        			}
	
						if (freeBITCOIN_RewardPoints === 'ON') {
							let accountRewardPoints = Number(window.content.document.getElementsByClassName('user_reward_points')[0].innerHTML.replace(',', ''));
							if (!window.content.document.getElementById('bonus_container_free_points')) {
								if (accountRewardPoints < 12) { }
								else if ((accountRewardPoints >= 12 ) && (accountRewardPoints < 120)) {
									iimDisplay('Activating 1 REWARD POINTS / ROLL...');
									log('freebitco.in', 'Activating \'1 REWARD POINTS / ROLL\'');
									iimPlayCode('SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 10\nTAG POS=1 TYPE=BUTTON ATTR=ONCLICK:RedeemRPProduct(\'free_points_1\')\nWAIT SECONDS=1');
									accountRewardPoints -= 12;
								}
								else if ((accountRewardPoints >= 120) && (accountRewardPoints < 600)) {
									iimDisplay('Activating 10 REWARD POINTS / ROLL...');
									log('freebitco.in', 'Activating \'10 REWARD POINTS / ROLL\'');
									iimPlayCode('SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 10\nTAG POS=1 TYPE=BUTTON ATTR=ONCLICK:RedeemRPProduct(\'free_points_10\')\nWAIT SECONDS=1');
									accountRewardPoints -= 120;
								}
								else if ((accountRewardPoints >= 600) && (accountRewardPoints < 1200)) {
									iimDisplay('Activating 50 REWARD POINTS / ROLL...');
									log('freebitco.in', 'Activating \'50 REWARD POINTS / ROLL\'');
									iimPlayCode('SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 10\nTAG POS=1 TYPE=BUTTON ATTR=ONCLICK:RedeemRPProduct(\'free_points_50\')\nWAIT SECONDS=1');
									accountRewardPoints -= 600;
								}
								else {
									iimDisplay('Activating 100 REWARD POINTS / ROLL...');
									log('freebitco.in', 'Activating \'100 REWARD POINTS / ROLL\'');
									iimPlayCode('SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 10\nTAG POS=1 TYPE=BUTTON ATTR=ONCLICK:RedeemRPProduct(\'free_points_100\')\nWAIT SECONDS=1');
									accountRewardPoints -= 1200;
								}
							}
	
							if (!window.content.document.getElementById('bonus_container_fp_bonus')) {
								if (accountRewardPoints < 2800) { }
								else if ((accountRewardPoints >= 2800) && (accountRewardPoints < 4400)) {
									iimDisplay('Activating 500% FREE BTC BONUS...');
									log('freebitco.in', 'Activating \'500% FREE BTC BONUS\'');
									iimPlayCode('SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 10\nTAG POS=1 TYPE=BUTTON ATTR=ONCLICK:RedeemRPProduct(\'fp_bonus_500\')\nWAIT SECONDS=1');
								}
								else
								{
									iimDisplay('Activating 1000% FREE BTC BONUS...');
									log('freebitco.in', 'Activating \'1000% FREE BTC BONUS\'');
									iimPlayCode('SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 10\nTAG POS=1 TYPE=BUTTON ATTR=ONCLICK:RedeemRPProduct(\'fp_bonus_1000\')\nWAIT SECONDS=1');
								}
							}
						}

						if (window.content.document.getElementsByClassName('cc_banner cc_container cc_container--open').length)
							iimPlayCode('SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 1\nTAG POS=1 TYPE=A ATTR=TXT:Got<SP>it!');

						iimDisplay('Determining type of captcha...');
						log('freebitco.in', 'Determining type of captcha...');
						window.scrollBy(0, 20000);

						if (window.content.document.getElementById('switch_captchas_button')) {
							iimDisplay('\'SWITCH CAPTCHA BUTTON\' is detected. Choosing double captchas.net. Solving...');
							log('freebitco.in', 'Double captchas.net is detected. Solving...');

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
								log('freebitco.in', 'reCAPTCHA v2 is detected. Solving...');

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
								log('freebitco.in', 'Captchas.net is detected. Solving...');
								
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
								log('freebitco.in', 'Solvemedia is detected. Solving...');

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
						log('freebitco.in', 'Claiming satoshis...');
						iimPlayCode('SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 10\nTAG POS=1 TYPE=INPUT:SUBMIT ATTR=ID:free_play_form_button\nWAIT SECONDS=8');

						if (Number(window.content.document.getElementById('winnings').innerHTML) > 0) {
							iimDisplay('Successfully claimed!');
							log('freebitco.in', 'Successfully claimed! Collected: ' + Number(window.content.document.getElementById('winnings').innerHTML).toFixed(8) + ' BTC; ' + Number(window.content.document.getElementById('fp_reward_points_won').innerHTML) + ' Reward Points; ' + Number(window.content.document.getElementById('fp_lottery_tickets_won').innerHTML) + ' Lottery Tickets');
							Winnings_freeBITCOIN += Number(window.content.document.getElementById('winnings').innerHTML);
							Rewards_freeBITCOIN  += Number(window.content.document.getElementById('fp_reward_points_won').innerHTML);
							Tickets_freeBITCOIN  += Number(window.content.document.getElementById('fp_lottery_tickets_won').innerHTML);
							break;
						} else {
							if ((window.content.document.getElementById('free_play_error').style.display !== 'none') && (window.content.document.getElementById('free_play_error').innerText.includes('verify'))) {
								iimDisplay('Email verification is detected...');
								log('freebitco.in', 'You must confirm email to continue collecting!');
								break;
							} else if ((window.content.document.getElementById('free_play_error').style.display !== 'none') && (window.content.document.getElementById('free_play_error').innerText.includes('blocked'))) {
								iimDisplay('Account of the https://freebitco.in/ has been banned...');
								log('freebitco.in', 'Account has been banned!');
								break;
							} else {
								iimDisplay('Captcha was solved incorrectly. Sending a report and trying to solve captcha again...');
								log('freebitco.in', 'Captcha was solved incorrectly. Sending a report and trying to solve captcha again...');
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
                    			log('freedoge.co.in', 'Connecting to the site...');
                    			iimPlayCode('SET !TIMEOUT_PAGE 30'
                           			+n+ 'TAB CLOSEALLOTHERS'
                            			+n+ 'TAB T=1'
                            			+n+ 'TAB CLOSE'
                            			+n+ 'URL GOTO=https://freedoge.co.in/'
                            			+n+ 'WAIT SECONDS=8');

                    			if (!window.content.document.getElementById('free_play_form_button')) {
                        			iimDisplay('Cloudflare protection is detected...');
                        			log('freedoge.co.in', 'Cloudflare protection is detected...');
                        			iimPlayCode('WAIT SECONDS=20');
                        			continue;
                    			}
                    			break;
                		} while (!window.content.document.getElementById('free_play_form_button'));

                		if (/^(\d+)m:(\d+)s/.exec(window.content.document.getElementsByTagName('title')[0].innerText)) {
                    			let timer = Number(/^(\d+)m:(\d+)s/.exec(window.content.document.getElementsByTagName('title')[0].innerText)[1]) * 60 + Number(/^(\d+)m:(\d+)s/.exec(window.content.document.getElementsByTagName('title')[0].innerText)[2]);
                    			timeTillNextRoll('freedoge.co.in', freeDOGECOIN_RandomTimer, timer);
                		}
                
                		let solvingCaptchaCycles = 1, answer = null;
                		while (solvingCaptchaCycles <= 5) {
					do {
						iimDisplay('Refreshing page...');
						log('freedoge.co.in', 'Refreshing page...');
						iimPlayCode('SET !TIMEOUT_PAGE 60'
							+n+ 'TAB CLOSEALLOTHERS'
							+n+ 'TAB T=1'
							+n+ 'TAB CLOSE'
							+n+ 'URL GOTO=https://freedoge.co.in/'
							+n+ 'WAIT SECONDS=8');
						if (!window.content.document.getElementById('free_play_form_button')) {
							iimDisplay('Cloudflare protection is detected...');
							log('freedoge.co.in', 'Cloudflare protection is detected...');
							iimPlayCode('WAIT SECONDS=20');
							continue;
						}
						break;
					} while (!window.content.document.getElementById('free_play_form_button'));

                    			if (/^(\d+)m:(\d+)s/.exec(window.content.document.getElementsByTagName('title')[0].innerText)) {
                        			iimDisplay('There was an exception...');
                        			log('freedoge.co.in', 'There was an exception...');
                        			break;
					}
					
					if (window.content.document.getElementById('free_play_captcha_types').value === 'solvemedia') {
						iimDisplay('Selecting reCAPTCHA v2...');
						log('freedoge.co.in', 'Selecting reCAPTCHA v2...');
						iimPlayCode('SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 10\nTAG POS=1 TYPE=SELECT ATTR=ID:free_play_captcha_types CONTENT=%recaptcha_v2\nWAIT SECONDS=2');
					}
	
					if (window.content.document.getElementsByClassName('cc_banner cc_container cc_container--open').length)
						iimPlayCode('SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 1\nTAG POS=1 TYPE=A ATTR=TXT:Got<SP>it!');

                    			iimDisplay('reCAPTCHA v2 is detected. Solving...');
					log('freedoge.co.in', 'reCAPTCHA v2 is detected. Solving...');
                   			window.scrollBy(0, 20000);
                        
					window.content.document.getElementById('g-recaptcha-response').style.display = '';
					iimPlayCode('SET !ERRORIGNORE YES'
						+n+ 'SET !TIMEOUT_STEP 10'
						+n+ 'FRAME F=1'
						+n+ 'TAG POS=1 TYPE=DIV ATTR=ROLE:presentation&&CLASS:recaptcha-checkbox-checkmark&&TXT:'
						+n+ 'WAIT SECONDS=8');

					if (!window.content.document.getElementById('g-recaptcha-response').value.length) {
						let data_sitekey = window.content.document.getElementsByClassName('g-recaptcha')[0].getAttribute('data-sitekey');
						answer = solveReCaptcha_ruCaptcha(data_sitekey, 'freedoge.co.in', 0);
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
					log('freedoge.co.in', 'Claiming dogetoshis...');
					iimPlayCode('SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 10\nTAG POS=1 TYPE=INPUT:SUBMIT ATTR=ID:free_play_form_button\nWAIT SECONDS=8');

					if (Number(window.content.document.getElementById('winnings').innerHTML) > 0) {
						iimDisplay('Successfully claimed!');
						log('freedoge.co.in', 'Successfully claimed! Collected: ' + Number(window.content.document.getElementById('winnings').innerHTML).toFixed(8) + ' DOGE ');
						Winnings_freeDOGECOIN += Number(window.content.document.getElementById('winnings').innerHTML);
						break;
					} else {
						iimDisplay('Unsuccessfully claimed!');
						if ((window.content.document.getElementById('free_play_error').style.display !== 'none') && (window.content.document.getElementById('free_play_error').innerText.includes('verify'))) {
							iimDisplay('Email verification is detected...');
							log('freedoge.co.in', 'You must confirm email to continue collecting!');
							break;
						} else if ((window.content.document.getElementById('free_play_error').style.display !== 'none') && (window.content.document.getElementById('free_play_error').innerText.includes('blocked'))) {
							iimDisplay('Account of the https://freedoge.co.in/ has been banned...');
							log('freedoge.co.in', 'Account has been banned!');
							break;
						} else {
							iimDisplay('Captcha was solved incorrectly. Sending a report and trying to solve captcha again...');
							log('freedoge.co.in', 'Captcha was solved incorrectly. Sending a report and trying to solve captcha again...');
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
						log('freenem.com', 'Connecting to the site...');
						iimPlayCode('SET !TIMEOUT_PAGE 60'
							+n+ 'TAB T=1'
							+n+ 'TAB CLOSEALLOTHERS'
							+n+ 'URL GOTO=https://freenem.com/free'
							+n+ 'WAIT SECONDS=8');

						if (!window.content.document.getElementsByClassName('main-button-2 roll-button').length) {
							iimDisplay('Logging to the https://freenem.com/...');
							log('freenem.com', 'Logging to the site...');
							iimPlayCode('SET !ERRORIGNORE YES'
								+n+ 'SET !TIMEOUT_PAGE 30'
								+n+ 'SET !TIMEOUT_STEP 10'
								+n+ 'TAG POS=1 TYPE=INPUT:EMAIL ATTR=NAME:email CONTENT=' + freeNEM_Login
								+n+ 'SET !ENCRYPTION NO'
								+n+ 'TAG POS=1 TYPE=INPUT:PASSWORD ATTR=NAME:password CONTENT=' + freeNEM_Password
								+n+ 'TAG POS=1 TYPE=BUTTON ATTR=TXT:LOGIN!'
								+n+ 'WAIT SECONDS=8');
							
							if (!window.content.document.getElementsByClassName('main-button-2 roll-button').length) {
                                				iimDisplay('Invisible reCAPTCHA v2 is detected. Solving...');
                                				log('freenem.com', 'Invisible reCAPTCHA v2 is detected. Solving...');

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
									+n+ 'WAIT SECONDS=8');

								 if (!window.content.document.getElementsByClassName('main-button-2 roll-button').length) {
									iimDisplay('Captcha was solved incorrectly. Sending a report and trying to solve captcha again...');
									log('freenem.com', 'Captcha was solved incorrectly. Sending a report and trying to solve captcha again...');
									reportCaptcha(answer['server'], answer['taskId']);
										
									if (authorizationCycles == 5) {
										notificationsBadCaptcha('freenem.com');
										break freeNemBody;
									}
									authorizationCycles++;
									continue;
								}
								iimDisplay('Successful authorization...');
								log('freenem.com', 'Successful authorization...');
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
						iimDisplay('Refreshing page and solving Invisible reCAPTCHA v2...');
						log('freenem.com', 'Refreshing page and solving Invisible reCAPTCHA v2...');
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
							log('freenem.com', 'There was an exception...');
                            				break freeNemBody;
                        			}

                        			iimPlayCode('SET !ERRORIGNORE YES'
                                			+n+ 'SET !TIMEOUT_PAGE 60'
                                			+n+ 'SET !TIMEOUT_STEP 10'
                                			+n+ 'TAG POS=1 TYPE=BUTTON ATTR=TXT:ROLL!'
                                			+n+ 'WAIT SECONDS=8');

						let winningDuringLastSession = Number(window.content.document.getElementsByClassName('result')[0].innerHTML.split(' ')[3]);
						if (!isNaN(winningDuringLastSession) || (winningDuringLastSession > 0)) {
                            				iimDisplay('Claiming NEM...'); log('freenem.com', 'Claiming NEM...');
                            				iimDisplay('Successfully claimed!'); log('freenem.com', 'Successfully claimed! Collected: ' + winningDuringLastSession.toFixed(8) + ' NEM');
							Winnings_freeNEM += winningDuringLastSession;
							break;
						} else {
                            				iimDisplay('Invisible reCAPTCHA v2 is detected. Solving...');
                            				log('freenem.com', 'Invisible reCAPTCHA v2 is detected. Solving...');

							let data_sitekey = window.content.document.getElementsByTagName('iframe')[0].src.split('?k=')[1].split('&co=')[0];
							let answer = solveReCaptcha_ruCaptcha(data_sitekey, 'freenem.com', 1);
							if (!answer['status']) {
								if (solvingCaptchaCycles == 5) {
									notificationsBadCaptcha('freenem.com');
									break;
								}
								solvingCaptchaCycles++;
								continue;
							}

							iimDisplay('Claiming NEM...');
							log('freenem.com', 'Claiming NEM...');
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
								log('freenem.com', 'Successfully claimed! Collected: ' + winningDuringLastSession.toFixed(8) + ' NEM');
								Winnings_freeNEM += winningDuringLastSession;
								break;
							} else {
								iimDisplay('Captcha was solved incorrectly. Sending a report and trying to solve captcha again...');
								log('freenem.com', 'Captcha was solved incorrectly. Sending a report and trying to solve captcha again...');
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
	}
	catch (e) {
        	iimDisplay('There was an error in the bot operation, check the connection to the Internet! The bot will be restarted in 30 seconds...');
	 	log('RESTART', 'There was an error in the bot operation, check the connection to the Internet! The bot will be restarted in 30 seconds...');
	}
}
