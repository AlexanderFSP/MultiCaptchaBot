## :mag_right:Description ##
`freebitco.in / freedoge.co.in / freenem.com [ MultiCaptchaBot ]` is a free bot using Mozilla Firefox and [iMacros add-on](https://addons.mozilla.org/ru/firefox/addon/imacros-for-firefox/) designed for automated gathering cryptocurrencies from [freebitco.in](https://freebitco.in/?r=1422489), [freedoge.co.in](http://freedoge.co.in/?r=327814) и [freenem.com](https://freenem.com/?ref=20120) every hour. Captcha recognition is carried out via [ruCaptcha.com / 2Captcha.com](https://rucaptcha.com?from=4507616) - services providing human captcha recognition. Script can be set up for any specific sites from supported list or all of them, if necessary. Also additional functionality can be turned on, such as automatic **Reward Points** applying (*on freebitco.in*) or random delay before collecting reward. In addition, bot is able to send reports on incorrectly solved captchas, logging, etc.
#### In the current version supported captcha types are: ####
1. [Captchas.net](http://captchas.net/) *(freebitco.in)*
2. [reCAPTCHA v2 / Invisible reCAPTCHA v2](https://www.google.com/recaptcha/intro/) *(freebitco.in / freedoge.co.in / freenem.com)*
3. [Solve Media](http://www.solvemedia.com/) *(freebitco.in)*
4. Other custom text captchas on the site *(freebitco.in)*
* * *
There is also the extended version exists. In this version bot can also (*in addition to foresaid*) send notifications to e-mail in case of failures and other critical situations and it provides choice of which service to use to recognize reCAPTCHA v2:
  1. [ruCaptcha.com / 2Captcha.com](https://rucaptcha.com?from=4507616)
  2. [X-Captcha.ru](http://x-captcha.ru/)
 
To get the extended version you will need to register on the sites using the referral links listed below and send your deposit addresses from *freebitco.in* and *freedoge.co.in* to `multicaptchabot@ya.ru`. In response you'll get the link to download and full instructions.
  1. https://freebitco.in/?r=1422489
  2. http://freedoge.co.in/?r=327814
  3. https://freenem.com/?ref=20120
* * * 
## :computer:Demo (YouTube) ##
[![Video demonstration about bot working on YouTube](https://static.wixstatic.com/media/ab398e_9df0e13a56c742f48e5a09f939e63d75~mv2.png)](https://www.youtube.com/watch?v=NxiYBPajKlE)
## :scroll:Install ##
*Instructions in Russian*: https://multicaptchabot.wixsite.com/multicaptchabot/instruction

:uk:Donwload `MCB_v510(EN).js`: https://yadi.sk/d/RBlHiweM3ULGjE<br />
:ru:Donwload `MCB_v510(RU).js`: https://yadi.sk/d/uLEGBYcp3ULGjL

### Step 1: ###
Download and install `Mozilla Firefox` **v47.0 - v49.0**.<br />*Download links for Windows*:<br />
**47.0**: https://filehippo.com/download_firefox/68389/<br />
**48.0**: https://filehippo.com/download_firefox/69488/<br />
**49.0**: https://filehippo.com/download_firefox/70459/<br /><br />
**[ IMPORTANT №1 ]** Open `about:config` and set `browser.tabs.closeWindowWithLastTab = false`<br />
**[ IMPORTANT №2 ]** Disable Mozilla Firefox updates
  ### Step 2: ###
Install `iMacros for Firefox` add-on **v8.9.7**.<br />
*Download link*: https://addons.mozilla.org/ru/firefox/addon/imacros-for-firefox/versions/<br /><br />
**[ IMPORTANT №3 ]** Disable iMacros updates (open `about:addons`, select `iMacros for Firefox` and click `More`. Scroll down and click `Off`)
  ### Step 3: ###
Sign up for sites which you are going to use bot for. Also register on captcha recognition service.<br />
*Registration link*: https://rucaptcha.com?from=4507616
  ### Step 4: ###
Download script and move it to iMacros folder (by default: `C:\Users\User\Documents\iMacros\Macros`).<br />
**[ IMPORTANT №4 ]** Before starting the bot create folder `C:\MultiCaptcha_bot`

`Line №5`: Place your `API KEY` from [ruCaptcha.com](https://rucaptcha.com/enterpage) / [2Captcha.com](https://2captcha.com/enterpage) instead of asterisks;<br />
`Lines №7-20`: Activate faucets you need and additional functions for them.<br />

**[ IMPORTANT №5 ]** In order to use *freenem.com* you will need to install any extension to block ads. I suggest installing Adblock Plus<br />
*Download link*: https://adblockplus.org/en/
```javascript
// [ Block №1 ]: User settings
const captchaPath      = 'C:\\MultiCaptcha_bot\\';         // Text captchas download path (Don't forget to use double backslashes)
const logPath 	       = 'C:\\MultiCaptcha_bot\\log.txt';  // Full log filename (Don't forget to use double backslashes)

const apiKey           = '******************************'; // Your ruCaptcha.com / 2Captcha.com API-KEY

// [ Block №2 ]: https://freebitco.in/
const freeBITCOIN              = 'OFF';  // [ON / OFF] - Use bot on https://freebitco.in/
const freeBITCOIN_RewardPoints = 'OFF';  // [ON / OFF] - Auto-apply Reward Points on https://freebitco.in/
const freeBITCOIN_RandomTimer  = 'OFF';  // [ON / OFF] - Random delay for from 30 seconds to 2 minutes before next roll on https://freebitco.in/

// [ Block №3 ]: https://freedoge.co.in/
const freeDOGECOIN             = 'OFF';  // [ON / OFF] - Use bot on https://freedoge.co.in/
const freeDOGECOIN_RandomTimer = 'OFF';  // [ON / OFF] - Random delay for from 30 seconds to 2 minutes before next roll on https://freedoge.co.in/

// [ Block №4 ]: https://freenem.com/
const freeNEM	               = 'OFF';            // [ON / OFF] - Use bot on https://freenem.com/
const freeNEM_Login            = '*************';  // Login (Required, because session is valid for 3 hours only)
const freeNEM_Password         = '*************';  // Password (For the same reason)
const freeNEM_RandomTimer      = 'OFF';	           // [ON / OFF] - Random delay for from 30 seconds to 2 minutes before next roll on https://freenem.com/
```
#### Reward Points applying algorhythm on freebitco.in: ####
REWARD POINTS BONUS:
  1) If there are < 12 RP - continue hoarding Reward Points;
  2) If there are >= 12 RP, but < 120 RP - spend 12 RP for `1 RP / ROLL` bonus;
  3) If there are >= 120 RP, but < 600 RP - spend 120 RP for `10 RP / ROLL` bonus;
  4) If there are >= 600 RP, but < 1200 RP - spend 600 RP for `50 RP / ROLL` bonus;
  5) If there are >= 1200 RP - spend 1200 RP for `100 RP / ROLL` bonus.

FREE BTC BONUS:
  1) If there are < 2800 RP - continue hoarding Reward Points;
  2) If there are >= 2800 RP, but < 4400 RP - spend 1600 RP for `500% BONUS`;
  3) If there are >= 4400 RP - spend 3200 RP for `1000% BONUS`.
  ### Step 5: ###
Add funds to your captcha recognition service account using any payment method you prefer.
  ### Step 6: ###
Select script in iMacros sidebar and start the bot with `Play` button.
## :money_with_wings:Donate ##
```
Bitcoin:  1CPu8TPTo4xPCdLmq2eZ764yofPuDwLLJU
Litecoin: LU7ng11BkaUWmTLuNpQ5RURUS29LnpGQ8L
Dogecoin: DDc5RJFAyNYrJvXaYAQkxLXCAPuNcAsFCQ
NEM:      NDFIBL-H7T3XX-KPWE2O-IEEMKH-FSS77B-CXU4YL-OOJW
Cardano:  DdzFFzCqrhtCFaMAWMDHvFRvctvXXBaHF3DoLtJ6rKun2WJt17Z4goRqdomE4PXiUpcUqQ3WfYpHF2icAka8qQHUMVU4aPXYKC9EbugN
Ripple:   rUuFTHy6fn6Su4FmcS15DxJK6J6gSuLRoV (Destination tag: 1)
Bytecoin: 22X4Qunt5s54JUfEtXUnXH795FNNWbHuzVvRAngMNufjXRmbrSQPBWMfNCezqRpKfLJf5dmANoy6uA2bGtZ3uT5fJH378F9
Siacoin:  200c142995ca38dd56b19c61d5434ed1b5a1212772ad23a3c681124df23a663944ca617449a0
```
