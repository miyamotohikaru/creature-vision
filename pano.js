const puppeteer=require('/Users/miyamotohikaru/hikaru323.github.io/creature-vision/node_modules/puppeteer-core');
const SS='/private/tmp/claude-501/-Users-miyamotohikaru/e315586b-6558-4e62-a93c-de5168972d0e/scratchpad';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--no-sandbox','--disable-gpu']});
  const page=await b.newPage(); await page.setViewport({width:800,height:1300});
  await page.goto('https://creature-vision-002.vercel.app/',{waitUntil:'networkidle2',timeout:60000});
  const input=await page.waitForSelector('input[type=file]',{timeout:15000});
  await input.uploadFile('/Users/miyamotohikaru/Downloads/IMG_8943_VSCO.JPG');
  await sleep(4500);
  await page.evaluate(()=>{[...document.querySelectorAll('button')].find(b=>/馬.*Horse/.test(b.textContent))?.click();});
  // wait for panorama (pano-img appears) up to 50s
  let ok=false;
  for(let t=0;t<50;t++){const has=await page.evaluate(()=>!!document.querySelector('.pano-img'));if(has){ok=true;break;}await sleep(1000);}
  console.log('panorama present:', ok);
  await sleep(1500);
  await page.screenshot({path:SS+'/pano-creature.png'});
  // buttons present?
  const btns=await page.evaluate(()=>[...document.querySelectorAll('button')].map(b=>b.textContent.trim()).filter(t=>/見回す|人間の目|の目に戻す/.test(t)));
  console.log('buttons:', JSON.stringify(btns));
  // click 人間の目で見る
  await page.evaluate(()=>{[...document.querySelectorAll('button')].find(b=>b.textContent.includes('人間の目で見る'))?.click();});
  await sleep(1500);
  await page.screenshot({path:SS+'/pano-human.png'});
  const label=await page.evaluate(()=>{const e=[...document.querySelectorAll('div')].find(d=>/人間のめ/.test(d.textContent)&&d.textContent.length<10);return e?e.textContent.trim():'(none)';});
  console.log('after human toggle, label seen:', label);
  await b.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
