const puppeteer = require('puppeteer');



function generate(length = 10) {
    var randomChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result; 
}
function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }
const base = generate();
const prefix = '_TEST_SCRIPT_BOT_'; 
const email = base + prefix+ '@devforth.io';
const second_base = generate();
const second_email = second_base + prefix + '@devforth.io';
const activate_bonus = Math.random() > 1;
const affiliate_user = Math.random() > 0.5;
console.log('activate_bonus', activate_bonus);
console.log('affiliate_user', affiliate_user);
console.log('email', email);
if (activate_bonus) {
  console.log('second_email', second_email);
}
const prodConfig = {
    headless: true,
    devtools: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  };
(async () => {
    //   const browser = await puppeteer.launch();

    const seconds = Math.floor(Math.random() * 4 * 60);
    console.log('WAITING FOR ' + seconds + ' seconds before starting')
    await delay(seconds * 1000);
    const browser = await puppeteer.launch(prodConfig);
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(100000); 
    page.setDefaultTimeout(100000);
    // page.on('console', consoleObj => console.log(consoleObj.text()));
    await page.authenticate({username:"admin", password:"admin"});
    async function OpenMenu(){
        await page.waitForSelector('[aria-label="Menu"]', {visible: true})
        await page.evaluate( async () => {
            const button = document.querySelector('[aria-label="Menu"]')
            button.click();
            console.log('menu clicked');
        })
    }
    async function logout(){
    // open menu to logout confirm
        await OpenMenu();
        await page.waitForSelector('[href="/logout"]', {visible: true})
        await page.evaluate( async () => {
            const logout = document.querySelector('[href="/logout"]')
            logout.click();
            console.log('logout clicked');
        
        })
        await page.waitForSelector('.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary', {visible: true})
        await page.evaluate( async () => {
            const confirm = document.querySelector('.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary');
            confirm.click();
            console.log('clicked logout');
        })
    }
    
    async function closeDeposit(){
        console.log('DepositAddress',DepositAddress);
        // wait for deposit dialog
        await page.waitForSelector('#close', {visible: true})
        await page.evaluate(() => {
            const button = document.querySelector('#close')
            button.click();
            console.log('close popup');
        }) 
    }
    async function airdropRequest(email) {
        console.log('callForAirdrop' + email)
        // make airdrop request
        await page.evaluate( async (email) => {
            const data = { email:email.toLowerCase() }
            console.log('sending request')
            const url = 'https://bo.rpdev.click/give_airdrop_dev';
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(data) 
            });
            console.log('response', response);
        },email);
    }
   
    async function registerWithdrawAccount(){
        await page.waitForSelector('[href="/register/"]', {visible: true});
        await page.evaluate(() => {
            const link = document.querySelector('[href="/register/"]')
            link.click();
            console.log('ok bonus click');
        })
        await page.waitForSelector('#email', {visible: true});
        await page.type('#email', second_email);
        await page.evaluate(() => {
            const password = document.getElementById('password');
            password.value = '';
        });
        await page.type('#password', second_email);
        await page.keyboard.press('Enter');
        console.log('LOADING LOBBY Withdrawal account')
    }
    async function closeInfo(){
        console.log('wait for confirmation')
        const ok_bonus_header = '#info-ok';
        await page.waitForSelector(ok_bonus_header, {visible: true})
        await page.evaluate((ok_bonus_header) => {
            const button = document.querySelector(ok_bonus_header)
            button.click();
            console.log('ok bonus click');
        },ok_bonus_header)
    }
    async function activateAirdrop(){
        console.log('activating airdrop')
        const bonus_activate_selector = '.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary'
        await page.waitForSelector(bonus_activate_selector, {visible: true})
        await page.evaluate((bonus_activate_selector) => {
            const button = document.querySelector(bonus_activate_selector)
            button.click();
            console.log('activate bonus popup');
        },bonus_activate_selector)
    
        //wait for confirmation
      await closeInfo();
    }
    async function makeWithdrawal(DepositAddress) {
        console.log('making withdrawal');
        await OpenMenu();
        await page.waitForSelector('[href="/withdraw"]', {visible: true});
        await page.evaluate(() => {
            const withdraw_link = document.querySelector('[href="/withdraw"]')
            withdraw_link.click();
            console.log('withdraw_link click');
        })
        await page.waitForSelector('#rocketpot-withdraw-bitcoin-address', {visible: true});
        await page.type('#rocketpot-withdraw-bitcoin-address', DepositAddress);
        console.log('waiting for money to comeback')
        await page.waitForFunction('document.querySelector(".custom-select-wrapper + div + div + div > div > div > div + div > div + div").textContent != "0"');
        console.log('awaited it successfuly')
       
        await page.evaluate(() => {
            const maxAmount = document.querySelector('#maxAmountButton');
            maxAmount.click();
            console.log('select Max amount');
        })
        await page.evaluate(() => {
            const withdrawButton = document.querySelector('#first_withdraw_button')
            withdrawButton.click();
            console.log('click first withdrawal');
        })
        await page.waitForSelector('#withdrawal_confirm_button', {visible: true});
        await page.evaluate(() => {
            const confirm = document.querySelector('#withdrawal_confirm_button');
            confirm.click();
            console.log('Confirm wd');
        })
        await closeInfo();
    }
    // begining of a script 
    if (affiliate_user){
    await page.goto('https://rpdev.click/register?token=WFZYDJosaPgsFZtB7v7yXWNd7ZgqdRLk');
    } else {
      await page.goto('https://rpdev.click/register');
    }
    
    await page.waitForSelector('#email', {visible: true});
    await page.type('#email', email);
    
    await page.evaluate(() => {
        const password = document.getElementById('password');
        password.value = '';
    });
    await page.type('#password', email);

    // if (affiliate_user){
    //   await page.evaluate(() => {
    //     const referal = document.getElementById('referal-code');
    //     referal.value = 'other_campaign';
    //   });
    //   // await page.type('#referal-code', email);

    // }
    await page.keyboard.press('Enter');
    console.log('LOADING LOBBY')

    let deposit_address_input = '#depositAddress';
    let DepositAddress = '';

   
    if (activate_bonus) {
        await page.waitForSelector(deposit_address_input, {visible: true})
    
        DepositAddress = await page.$eval(deposit_address_input, (input) => {
            return input.getAttribute("value")
        });
      console.log('activating bonus')
      await closeDeposit();
      await logout();
      await registerWithdrawAccount();
      await closeDeposit();
      await airdropRequest(second_email);
      await activateAirdrop();
      await makeWithdrawal(DepositAddress);
      await logout();

      await page.waitForSelector('[href="/login/"]', {visible: true});
      await page.evaluate(() => {
          const link = document.querySelector('[href="/login/"]')
          link.click();
          console.log('ok bonus click');
      })
      await page.waitForSelector('#email', {visible: true});
      await page.type('#email', email);
      await page.evaluate(() => {
          const password = document.getElementById('password');
          password.value = '';
      });
      await page.type('#password', email);
      await page.keyboard.press('Enter');
      console.log('LOADING LOBBY Normal account')


      await OpenMenu();
      await page.waitForSelector(('.menu-payments > div > span > span'), {visible: true});
      console.log('balance visible')
      const element = await page.$(".menu-payments > div > span > span");
      const text = await page.evaluate(element => element.textContent, element);
      console.log('TEXTELEMENT', text);
      await page.waitForFunction('document.querySelector(".menu-payments > div > span > span").textContent != "0.00000000"');
      console.log('GOT DEPOSIT!'); 
      console.log('GOING TO BONUS TAB')   
      await page.evaluate(() => {
        const link = document.querySelector('[href="/bonus"]')
        link.click();
        console.log('got to bonus page click');
      })
      const ftd_cativate_selector = '[aria-hidden="false"] button';
      await page.waitForSelector((ftd_cativate_selector), {visible: true});
      
      await page.evaluate((ftd_cativate_selector) => {
        const link = document.querySelector(ftd_cativate_selector)
        link.click();
        console.log('ftd activation click');
      },ftd_cativate_selector)

      const confirm_ftd_click_selector = '[style="max-width: 610px;"] button:nth-child(2)';
      await page.waitForSelector((confirm_ftd_click_selector), {visible: true});
      await page.evaluate((confirm_ftd_click_selector) => {
        const link = document.querySelector(confirm_ftd_click_selector)
        link.click();
        console.log('ftd activation confirm');
      },confirm_ftd_click_selector)

      await closeInfo();
    } else {
      console.log('no bonuses');
      await closeDeposit();
      await airdropRequest(email);
      await activateAirdrop();
    }

    // go to the game
    console.log('go to the game')
    await page.evaluate(() => {
        const game = document.querySelectorAll('[href="/bgaming/all-lucky-clovers-100/"]')
        if(game.length){
            game[0].click();
        } else {
            game.click();
        }
        console.log('open the game');
    })
    await delay(15000);
    //focus on iframe
    await page.evaluate(() => {
        const iframe = document.querySelector('iframe');
        iframe.contentWindow.focus();   
        console.log('focus');
    })
    // make bets
    setInterval(async function(){
        await page.keyboard.press('Space');
        console.log('click space')
    },500)
})();
