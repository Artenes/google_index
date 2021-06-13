/**
 * Prints a log
 * @param {any} value 
 */
const print = (value) => {
    const debug = false
    if (debug) {
        console.log("[RESULT_INDEX_ADDON]:" + value)
    }
}

/**
 * Gets data from storage
 * @param {string} key 
 * @returns 
 */
const get = async(key) => {

    const promise = new Promise((resolve, reject) => {

        chrome.storage.local.get(key, answer => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError)
            }
            
            const value = answer[key]
            resolve(value)
        });

    })

    return promise

}

/**
 * Puts data in storage
 * @param {string} key 
 * @param {string} value 
 * @returns 
 */
const put = async(key, value) => {

    const promise = new Promise((resolve, reject) => {

        const indexData = {
            [key]: value
        }

        chrome.storage.local.set(indexData, () => {
            if (chrome.runtime.lastError) {
                return reject()
            } else {
                resolve()
            }
        })

    })

    return promise

}

/**
 * Runs main code
 */
const main = async() => {

    //adds ui to google results page
    const topStuff = document.getElementById("topstuff")
    const response = await fetch(chrome.runtime.getURL('/index.html'))
    const content = await response.text()
    topStuff.insertAdjacentHTML("afterbegin", content)

    //gets the google query and use as key to store user input's in storage
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const queryKey = urlParams.get('q').replaceAll(" ", "+")
    const storageKey = "resultindex_" + queryKey

    //when text area changes, set new value on storage
    const textArea = document.getElementById("resultindex_textarea")
    textArea.addEventListener("input", async () => {
        const text = textArea.value
        const result = await put(storageKey, text)
        if (result instanceof Error === false) {
            print(`Set ${storageKey} = ${text}`)
        } else {
            print(`Error set ${storageKey} = ${result}`)
        }
    })

    //fills text area with data from storage
    const data = await get(storageKey)
    if (data instanceof Error === false && data !== undefined) {
        textArea.innerHTML = data
        print(`Set [${storageKey}] = (${data}) into text area`)
    } else {
        print(`Error get ${storageKey} = ${data}`)
    }

}

main()