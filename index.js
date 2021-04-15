
let btnScrap = document.getElementById('btnScrap')

btnScrap.addEventListener('click', async()=>{
    const [tab] = await chrome.tabs.query({active:true, currentWindow:true})
    chrome.scripting.executeScript({
        target: {
            tabId: tab.id
        },
        function: scrapingProfile
    })
})


const scrapingProfile = async () => {
    const Person  = {
        profile: {
            name: 'div.ph5.pb5 > .mt2 > div.mr5 > ul.pv-top-card--list > li',
            resume: '.ph5.pb5 > .mt2 > .mr5 > h2',
            country: '.ph5 > .mt2 > .mr5 > ul > li.t-16.t-black',            
            linkPerfil: 'section.pv-contact-info__contact-type > div > a',
            numberPhone: '.pv-contact-info__contact-type > ul > li',
            email: '.pv-contact-info__contact-type.ci-email > div > a',
            create_at: 'section.pv-contact-info__contact-type.ci-connected > div > span',
        },
        buttonsAndPopups:{
            buttonClose: 'button.artdeco-modal__dismiss',
            buttonSeeMoore: '[data-control-name="contact_see_more"]',
            buttonAbout: '[data-test-line-clamp-show-more-button="true"]',
            buttonJobSeemore: 'button.inline-show-more-text__button.link'
        },
        about:'span.lt-line-clamp__raw-line',
        experiences: {
            positionJob: 'div.mb2 > h3',
            companyName: 'div.mb2 > p.pv-entity__secondary-title.t-14.t-black.t-normal',
            startAndEndDate: 'div.mb2 > div > h4.pv-entity__date-range > span:nth-child(2)',
            duration: 'div.mb2 > div > h4:nth-child(2) > span.pv-entity__bullet-item-v2',
            countryJob: 'div.mb2 > h4 > span:nth-child(2)',
            descritionJob: ''
        }
    }
    //utils 
    // metodo para esperar la pagina y sea asyncrona
    const wait = (miliseconds) => {
        return new Promise((resolve)=>{
            setTimeout(()=>{
                resolve()
            },miliseconds)
        })
    }

    const autoScrollToElement = async (selector) => {
        const exists = document.querySelector(selector)

        while(exists){
            let maxScrollTop = document.body.clientHeight - window.innerHeight
            let elementScrollTop = document.querySelector(selector).offsetHeight
            let currentScrollTop = window.scrollY

            if (maxScrollTop == currentScrollTop || elementScrollTop <= currentScrollTop)
                break

            await wait(32)

            let newScrollTop = Math.min(currentScrollTop + 20, maxScrollTop)

            window.scrollTo(0, newScrollTop)
        }
        console.log(`Finish autoscroll to element ${selector}`)

        return new Promise((resolve)=>{
            resolve()
        })
    }
    
    const getContactProfile = async ()=> {
        const {
        profile : {
            name,
            resume,
            country, 
            linkPerfil,
            numberPhone,
            email,
            create_at,
        },
        buttonsAndPopups:{
            buttonSeeMoore,
            buttonClose
        }
    } = Person

        const nameProfile = document.querySelector(name)?.innerText
        const resumeProfile = document.querySelector(resume)?.innerText
        const countryProfile = document.querySelector(country)?.innerText

        // get See moore profile
        const buttonSeeMooreProfile = document.querySelector(buttonSeeMoore)
        buttonSeeMooreProfile.click()
        await wait(1000)

        const linkPerfilProfile = document.querySelector(linkPerfil)?.innerText
        const numberPhoneProfile = document.querySelector(numberPhone)?.innerText
        const emailProfile = document.querySelector(email)?.innerText
        const create_atProfile = document.querySelector(create_at)?.innerText
        const buttonCloseProfile = document.querySelector(buttonClose)
        buttonCloseProfile.click()
        
        return {nameProfile,resumeProfile,countryProfile, linkPerfilProfile,
            numberPhoneProfile,emailProfile,create_atProfile}
    }

    const getAboutProfile = async ({buttonsAndPopups:{buttonAbout}, about} = Person) => {
        const buttonAboutProfile = document.querySelector(buttonAbout)
        buttonAboutProfile.click()
        await wait(500)

        const aboutProfile = document.querySelector(about)?.innerText

        return {aboutProfile}

    }

    const getExperiencesProfile = 
        async ({experiences:{positionJob,companyName,startAndEndDate,duration,countryJob,descritionJob}} = Person) => {

            const ul = document.querySelector('#experience-section > ul')
            const li = ul.querySelectorAll('li.pv-entity__position-group-pager.pv-profile-section__list-item.ember-view')
            const list = Array.from(li)
            
            const experienceList = list.map((el)=>{
                const positionJobProfile = document.querySelector(positionJob)?.innerText
                const companyNameProfile = document.querySelector(companyName)?.innerText
                const startAndEndDateProfile = document.querySelector(startAndEndDate)?.innerText
                const durationProfile = document.querySelector(duration)?.innerText
                const countryJobProfile = document.querySelector(countryJob)?.innerText

                return {positionJobProfile,companyNameProfile,startAndEndDateProfile,durationProfile,countryJobProfile}
            })

            for (const i in list) {
                const item = list[i]
                //itemsExperiences = Array.from(item)
                const experiencesData = []
                experiencesData.map((e)=>{
                const positionJobProfile = document.querySelector(positionJob)[item]?.innerText
                const companyNameProfile = document.querySelector(companyName)[item]?.innerText
                const startAndEndDateProfile = document.querySelector(startAndEndDate)[item]?.innerText
                const durationProfile = document.querySelector(duration)[item]?.innerText
                const countryJobProfile = document.querySelector(countryJob)[item]?.innerText
                return {positionJobProfile,companyNameProfile,startAndEndDateProfile,durationProfile,countryJobProfile}
                })

                experienceList.push(...experiencesData)
            }
            
            return experienceList
        }

    const scrapProfile = await [getContactProfile(),getAboutProfile(),getExperiencesProfile()]
    await autoScrollToElement('body')
    console.log(scrapProfile)
}




