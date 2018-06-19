'use strict';

const puppeteer = require('puppeteer');
const searchKey = 'android';

(async(key) => {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto(`https://www.infojobs.com.br/empregos.aspx?Palabra=${key}&Provincia=187`);

  // Se fosse manualmente via primeira página
  //await page.type('.js_txtFti input', 'developer');
  //await page.select('#ctl00_phMasterPage_cFinderNew_drpLocation2','Santa Catarina');
  //await page.click('.jsBtnSearch');
  const selectorVaga = '.vagaTitle';
  await page.waitForSelector('.vaga ');

  const links = await page.evaluate(selectorVaga => {
    const vagas = Array.from(document.querySelectorAll(selectorVaga));
    return vagas.map(vaga => { 
      return vaga.href;
    });
  }, selectorVaga);
  
  console.log(links)

  const dados = []
  
  for(let link of links) {
    await page.goto(link);
      await page.waitForSelector('.advisor-vacancy-summary'); 
      let nome = await page.$eval('#ctl00_phMasterPage_cVacancySummary_litVacancyTitle', elem => elem.textContent);
      let empresa = await page.$eval('#ctl00_phMasterPage_cVacancySummary_aCompany', elem=> elem.title);
      let jornada = await page.$eval('#ctl00_phMasterPage_cVacancySummary_litWorkingHours', elem => elem.textContent);
      let tipoContrato = await page.$eval('#ctl00_phMasterPage_cVacancySummary_litContractType', elem => elem.textContent);
      let salario = await page.$eval('#ctl00_phMasterPage_cVacancySummary_litSalary', elem => elem.textContent);
      let regiao = await page.$eval('#ctl00_phMasterPage_cVacancySummary_litLocation', elem => elem.textContent);
      let descricao = await page.$$eval('ol.descriptionItems li', elems => elems.map(elem => elem.textContent));
      
      let vagaPostada = { 
        nome,empresa, jornada,tipoContrato,salario,regiao,descricao
      }

      dados.push(vagaPostada);
  }

  console.log(dados)

  await browser.close();
})(searchKey);

