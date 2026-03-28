onUiLoaded(setupStylez);

let orgPrompt = '';
let orgNegative = '';
let tabname = '';
let promptNeg = '';
let promptPos = '';

function setupStylez() {
    const app = gradioApp();

    // create new button (t2i)
    const t2i_StyleBtn = document.createElement("button");
    t2i_StyleBtn.setAttribute("class", "lg secondary gradio-button tool svelte-cmf5ev");
    t2i_StyleBtn.setAttribute("id", "t2i_stylez_btn");
    t2i_StyleBtn.setAttribute("type", "button");
    t2i_StyleBtn.setAttribute("onClick", "showHideStylez()");
    t2i_StyleBtn.innerText = `🎨`;

    // add new button
    const txt2img_tools = app.getElementById("txt2img_clear_prompt");
    if (txt2img_tools && txt2img_tools.parentNode) {
        txt2img_tools.parentNode.appendChild(t2i_StyleBtn);
    }

    // create new button (i2i)
    const i2i_StyleBtn = document.createElement("button");
    i2i_StyleBtn.setAttribute("class", "lg secondary gradio-button tool svelte-cmf5ev");
    i2i_StyleBtn.setAttribute("id", "i2i_stylez_btn");
    i2i_StyleBtn.setAttribute("type", "button");
    i2i_StyleBtn.setAttribute("onClick", "showHideStylez()");
    i2i_StyleBtn.innerText = `🎨`;

    // add new button
    const img2img_tools = app.getElementById("img2img_clear_prompt");
    if (img2img_tools && img2img_tools.parentNode) {
        img2img_tools.parentNode.appendChild(i2i_StyleBtn);
    }

    // Setup Browser
    const hideoldbar = app.querySelector('#hide_default_styles > label > input');
    if (hideoldbar) {
        if (hideoldbar.checked === true) {
            hideOldStyles(true);
        } else {
            hideOldStyles(false);
        }
    }

    // IMPORTANT:
    // Do NOT move the #Stylez container into the main tabs container.
    // That caused the panel to render as an empty/duplicated tab.
    // We only hide the visible tab button here.

    hideStylezTabButton();

    const stylezContainer = app.querySelector("#Stylez");
    console.log(stylezContainer);

    // Keep the old UI hidden tab hidden, but still usable from the custom button.
    // If the root container is displayed by JS, it behaves like an overlay/popup.
    if (stylezContainer) {
        stylezContainer.style.display = "none";
    }

    // hide old styles toggle
    const oldStylesBox = app.querySelector('#hide_default_styles');
    if (oldStylesBox) {
        const input = oldStylesBox.querySelector('input');
        if (input) {
            input.addEventListener('change', () => {
                hideOldStyles(input.checked);
            });
        }
    }
}

function hideStylezTabButton() {
    const app = gradioApp();
    const tabNav = app.querySelector(".tab-nav");
    if (!tabNav) return;

    const buttons = tabNav.querySelectorAll("button");
    buttons.forEach(button => {
        const text = (button.innerText || button.textContent || "").trim();
        if (text === "Stylez" || text === "stylez_menutab") {
            button.style.display = "none";
            button.setAttribute("aria-hidden", "true");
            button.tabIndex = -1;
        }
    });
}

function hideOldStyles(bool) {
    const app = gradioApp();

    const stylesOld_t2i = app.getElementById("txt2img_styles_row");
    const stylesOld_i2i = app.getElementById("img2img_styles_row");

    if (bool === true) {
        if (stylesOld_t2i) stylesOld_t2i.style.display = 'none';
        if (stylesOld_i2i) stylesOld_i2i.style.display = 'none';
    } else {
        if (stylesOld_t2i) stylesOld_t2i.style.display = 'block';
        if (stylesOld_i2i) stylesOld_i2i.style.display = 'block';
    }
}

function showHideStylez() {
    const stylez = gradioApp().getElementById("Stylez");
    if (!stylez) return;

    const computedStyle = window.getComputedStyle(stylez);
    if (computedStyle.getPropertyValue("display") === "none" || computedStyle.getPropertyValue("visibility") === "hidden") {
        stylez.style.display = "block";
    } else {
        stylez.style.display = "none";
    }
}

// get active tab
function getENActiveTab() {
    let activetab = "";
    const tab = gradioApp().getElementById("tab_txt2img");
    if (!tab) return "txt2img";

    const computedStyle = window.getComputedStyle(tab);
    if (computedStyle.getPropertyValue("display") === "none" || computedStyle.getPropertyValue("visibility") === "hidden") {
        activetab = "img2img";
    } else {
        activetab = "txt2img";
    }
    return (activetab);
}

function tabCheck(mutationsList, observer) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            const tabTxt2img = gradioApp().getElementById('tab_txt2img');
            const tabImg2img = gradioApp().getElementById('tab_img2img');
            const stylez = gradioApp().getElementById("Stylez");

            if (stylez && tabTxt2img && tabTxt2img.style.display === 'none') {
                stylez.style.display = "none";
                tabname = getENActiveTab();
                promptPos = gradioApp().querySelector(`#${tabname}_prompt > label > textarea`);
                promptNeg = gradioApp().querySelector(`#${tabname}_neg_prompt > label > textarea`);
            }

            if (stylez && tabImg2img && tabImg2img.style.display === 'none') {
                stylez.style.display = "none";
                tabname = getENActiveTab();
                promptPos = gradioApp().querySelector(`#${tabname}_prompt > label > textarea`);
                promptNeg = gradioApp().querySelector(`#${tabname}_neg_prompt > label > textarea`);
            }
        }
    }
}

// check to see if gradio is fully loaded
function checkElement() {
    const tabTxt2img = gradioApp().getElementById('tab_txt2img');
    if (tabTxt2img) {
        const observer = new MutationObserver(tabCheck);

        tabname = getENActiveTab();
        promptPos = gradioApp().querySelector(`#${tabname}_prompt > label > textarea`);
        promptNeg = gradioApp().querySelector(`#${tabname}_neg_prompt > label > textarea`);

        const tab_txt2img = gradioApp().getElementById('tab_txt2img');
        const tab_img2img = gradioApp().getElementById('tab_img2img');
        const config = { attributes: true };

        if (tab_txt2img) observer.observe(tab_txt2img, config);
        if (tab_img2img) observer.observe(tab_img2img, config);

        const style_savefolder_temp = gradioApp().querySelector("#style_savefolder_temp > label > textarea");
        if (style_savefolder_temp) {
            applyValues(style_savefolder_temp, "Styles");
        }

        const styleSaveBtn = gradioApp().getElementById('style_save_btn');
        if (styleSaveBtn) {
            styleSaveBtn.addEventListener('click', () => {
                saveRefresh();
            });
        }

        const styleDeleteBtn = gradioApp().getElementById('style_delete_btn');
        if (styleDeleteBtn) {
            styleDeleteBtn.addEventListener('click', () => {
                deleteRefresh();
            });
        }

        if (typeof setupcivitapi === "function") {
            setupcivitapi();
        }
    } else {
        setTimeout(checkElement, 100);
    }
}
checkElement();

// apply styles
function applyStyle(prompt, negative, origin) {
    const applyStylePrompt = gradioApp().querySelector('#styles_apply_prompt > label > input');
    const applyStyleNeg = gradioApp().querySelector('#styles_apply_neg > label > input');

    orgPrompt = promptPos ? promptPos.value : "";
    orgNegative = promptNeg ? promptNeg.value : "";

    if (origin == "Stylez") {
        prompt = removeFirstAndLastCharacter(prompt);
        negative = removeFirstAndLastCharacter(negative);

        if (prompt.includes("{prompt}")) {
            const promptPossections = prompt.split("{prompt}");
            const promptPossectionA = promptPossections[0].trim();
            const promptPossectionB = promptPossections[1].trim();

            if (orgPrompt.includes(promptPossectionA) & orgPrompt.includes(promptPossectionB)) {
                orgPrompt = orgPrompt.replace(promptPossectionA, "");
                orgPrompt = orgPrompt.replace(promptPossectionB, "");
                orgPrompt = orgPrompt.replace(/^\s+/, "");
                orgPrompt = orgPrompt.replace(/^,+/g, "");
                orgPrompt = orgPrompt.replace(/^\s+/, "");

                if (applyStylePrompt && applyStylePrompt.checked === true) {
                    applyValues(promptPos, orgPrompt);
                }
            } else {
                appendStyle(applyStylePrompt, prompt, orgPrompt, promptPos);
            }
        } else {
            if (prompt !== "") {
                if (orgPrompt.includes(prompt) || orgPrompt.includes(", " + prompt)) {
                    if (orgPrompt.includes(prompt)) { }
                    orgPrompt = orgPrompt.replace(", " + prompt, "");
                    orgPrompt = orgPrompt.replace(prompt, "");
                    orgPrompt = orgPrompt.replace(/^\s+/, "");
                    orgPrompt = orgPrompt.replace(/^,+/g, "");
                    orgPrompt = orgPrompt.replace(/^\s+/, "");

                    if (applyStylePrompt && applyStylePrompt.checked === true) {
                        applyValues(promptPos, orgPrompt);
                    }
                } else {
                    appendStyle(applyStylePrompt, prompt, orgPrompt, promptPos);
                }
            }
        }

        if (negative !== "") {
            if (orgNegative.includes(negative) || orgNegative.includes(", " + negative)) {
                if (orgNegative.includes(negative)) { }
                orgNegative = orgNegative.replace(", " + negative, "");
                orgNegative = orgNegative.replace(negative, "");
                orgNegative = orgNegative.replace(/^\s+/, "");
                orgNegative = orgNegative.replace(/^,+/g, "");
                orgNegative = orgNegative.replace(/^\s+/, "");

                if (applyStyleNeg && applyStyleNeg.checked === true) {
                    applyValues(promptNeg, orgNegative);
                }
            } else {
                appendStyle(applyStyleNeg, negative, orgNegative, promptNeg);
            }
        }
    } else {
        prompt = decodeURIComponent(prompt).replaceAll(/%27/g, "'");
        negative = decodeURIComponent(negative).replaceAll(/%27/g, "'");

        if (orgPrompt.includes(prompt) || orgPrompt.includes(", " + prompt)) {
            if (orgPrompt.includes(prompt)) { }
            orgPrompt = "";
            if (applyStylePrompt && applyStylePrompt.checked === true) {
                applyValues(promptPos, orgPrompt);
            }
        } else {
            appendStyle(applyStylePrompt, prompt, "", promptPos);
        }

        if (orgNegative.includes(negative) || orgNegative.includes(", " + negative)) {
            if (orgNegative.includes(negative)) { }
            orgNegative = "";
            if (applyStyleNeg && applyStyleNeg.checked === true) {
                applyValues(promptNeg, orgNegative);
            }
        } else {
            appendStyle(applyStyleNeg, negative, "", promptNeg);
        }
    }
}

function hoverPreviewStyle(prompt, negative, origin) {
    const enablePreviewChk = gradioApp().querySelector('#HoverOverStyle_preview > label > input');
    const enablePreview = enablePreviewChk ? enablePreviewChk.checked : false;

    if (enablePreview === true) {
        const previewbox = gradioApp().getElementById("stylezPreviewBoxid");
        if (!previewbox) return;

        previewbox.style.display = "block";

        if (origin == "Stylez") {
            prompt = removeFirstAndLastCharacter(prompt);
            negative = removeFirstAndLastCharacter(negative);
        } else {
            prompt = decodeURIComponent(prompt).replaceAll(/%27/g, "'");
            negative = decodeURIComponent(negative).replaceAll(/%27/g, "'");
        }

        if (prompt == "") {
            prompt = "NULL";
        }
        if (negative == "") {
            negative = "NULL";
        }

        const pos = gradioApp().getElementById("stylezPreviewPositive");
        const neg = gradioApp().getElementById("stylezPreviewNegative");
        if (pos) pos.textContent = "Prompt: " + prompt;
        if (neg) neg.textContent = "Negative: " + negative;
    }
}

function hoverPreviewStyleOut() {
    const previewbox = gradioApp().getElementById("stylezPreviewBoxid");
    const pos = gradioApp().getElementById("stylezPreviewPositive");
    const neg = gradioApp().getElementById("stylezPreviewNegative");

    if (pos) pos.textContent = "Prompt: ";
    if (neg) neg.textContent = "Negative: ";
    if (previewbox) previewbox.style.display = "none";
}

function appendStyle(applyStyle, prompt, oldprompt, promptbox) {
    if (applyStyle && applyStyle.checked === true) {
        if (prompt.includes("{prompt}")) {
            oldprompt = promptbox.value;
            prompt = prompt.replace('{prompt}', oldprompt);
            promptbox.value = prompt;
            updateInput(promptbox);
        } else {
            if (oldprompt === '') {
                oldprompt = prompt;
                promptbox.value = prompt;
                updateInput(promptbox);
            } else {
                promptbox.value = oldprompt + ", " + prompt;
            }
            updateInput(promptbox);
        }
    }
}

function applyValues(a, b) {
    if (!a) return;
    a.value = b;
    updateInput(a);
}

function removeFirstAndLastCharacter(inputString) {
    if (!inputString) return "";
    if (inputString.length >= 2) {
        return inputString.slice(1, -1);
    } else {
        inputString = "";
        return inputString;
    }
}

function cardSizeChange(value) {
    const styleCards = gradioApp().querySelectorAll('.style_card');
    styleCards.forEach((card) => {
        card.style.minHeight = value + 'px';
        card.style.maxHeight = value + 'px';
        card.style.minWidth = value + 'px';
        card.style.maxWidth = value + 'px';
    });
}

function filterSearch(cat, search) {
    let searchString = (search || "").toLowerCase();
    const styleCards = gradioApp().querySelectorAll('.style_card');

    if (searchString == "") {
        if (cat == "All") {
            styleCards.forEach(card => {
                card.style.display = "flex";
            });
        } else if (cat == "Favourites") {
            styleCards.forEach(card => {
                var btn = card.querySelector(".favouriteStyleBtn");
                let computedelem = getComputedStyle(btn);
                if (computedelem.color === "rgb(255, 255, 255)") {
                    card.style.display = "none";
                } else {
                    card.style.display = "flex";
                }
            });
        } else {
            styleCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (cardCategory == cat) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        }
    } else {
        if (cat == "All") {
            styleCards.forEach(card => {
                const cardTitle = card.getAttribute('data-title');
                if (cardTitle && cardTitle.includes(searchString)) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        } else if (cat == "Favourites") {
            styleCards.forEach(card => {
                const cardTitle = card.getAttribute('data-title');
                var btn = card.querySelector(".favouriteStyleBtn");
                let computedelem = getComputedStyle(btn);
                if (cardTitle && cardTitle.includes(searchString)) {
                    if (computedelem.color === "rgb(255, 255, 255)") {
                        card.style.display = "none";
                    } else {
                        card.style.display = "flex";
                    }
                } else {
                    card.style.display = "none";
                }
            });
        } else {
            styleCards.forEach(card => {
                const cardTitle = card.getAttribute('data-title');
                const cardCategory = card.getAttribute('data-category');
                if (cardTitle && cardTitle.includes(searchString) && cardCategory == cat) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        }
    }
}

function editStyle(title, img, description, prompt, promptNeggative, folder, filename, origin) {
    if (origin == "Stylez") {
        prompt = removeFirstAndLastCharacter(prompt);
        promptNeggative = removeFirstAndLastCharacter(promptNeggative);
    } else {
        prompt = decodeURIComponent(prompt).replaceAll(/%27/g, "'");
        promptNeggative = decodeURIComponent(promptNeggative.replaceAll(/%27/g, "'"));
    }

    const editorTitle = gradioApp().querySelector('#style_title_txt > label > textarea');
    applyValues(editorTitle, title);

    const imgUrlHolderElement = gradioApp().querySelector('#style_img_url_txt > label > textarea');
    applyValues(imgUrlHolderElement, img);

    const editorDescription = gradioApp().querySelector('#style_description_txt > label > textarea');
    applyValues(editorDescription, description);

    const editorPrompt = gradioApp().querySelector('#style_prompt_txt > label > textarea');
    applyValues(editorPrompt, prompt);

    const editorPromptNeggative = gradioApp().querySelector('#style_negative_txt > label > textarea');
    applyValues(editorPromptNeggative, promptNeggative);

    const editorSaveFolder = gradioApp().querySelector('#style_savefolder_txt > label > div > div > div > input');
    const editorTempFolder = gradioApp().querySelector('#style_savefolder_temp > label > textarea');
    applyValues(editorTempFolder, folder);
    applyValues(editorSaveFolder, folder);

    const editorFilename = gradioApp().querySelector('#style_filename_txt > label > textarea');
    filename = decodeURIComponent(filename);
    filename = filename.replace('.json', '');
    applyValues(editorFilename, filename);

    const tabsdiv = gradioApp().getElementById(`Stylez`);
    if (!tabsdiv) return;

    function findEditorButton() {
        const buttons = tabsdiv.querySelectorAll('button');
        for (const button of buttons) {
            if (button.innerText === 'Style Editor') {
                return button;
            }
        }
        return null;
    }

    const editorButton = findEditorButton();
    if (editorButton) {
        editorButton.click();
    }
}

function grabLastGeneratedimage() {
    const imagegallery = gradioApp().querySelector(`#${tabname}_gallery`);
    if (imagegallery) {
        const firstImage = imagegallery.querySelector('img');
        if (firstImage) {
            let imageSrc = firstImage.src;
            imageSrc = imageSrc.replace(/.*file=/, '');
            imageSrc = imageSrc.split('?')[0];
            imageSrc = decodeURIComponent(imageSrc);

            const imgUrlHolderElement = gradioApp().querySelector('#style_img_url_txt > label > textarea');
            applyValues(imgUrlHolderElement, imageSrc);
        }
    }
}

function grabCurrentSettings() {
    const editorPrompt = gradioApp().querySelector('#style_prompt_txt > label > textarea');
    applyValues(editorPrompt, promptPos ? promptPos.value : "");

    const editorPromptNeggative = gradioApp().querySelector('#style_negative_txt > label > textarea');
    applyValues(editorPromptNeggative, promptNeg ? promptNeg.value : "");
}

function deleteRefresh() {
    const galleryrefresh = gradioApp().querySelector('#style_refresh');
    const stylesclear = gradioApp().querySelector('#style_clear_btn');
    if (galleryrefresh) galleryrefresh.click();
    if (stylesclear) stylesclear.click();
}

function saveRefresh() {
    setTimeout(() => {
        const galleryrefresh = gradioApp().querySelector('#style_refresh');
        if (galleryrefresh) galleryrefresh.click();
    }, 1000);
}

function addFavourite(folder, filename, element) {
    let computedelem = getComputedStyle(element);
    const addfavouritebtn = gradioApp().querySelector('#stylezAddFavourite');
    const removefavouritebtn = gradioApp().querySelector('#stylezRemoveFavourite');
    filename = decodeURIComponent(filename);

    const favTempFolder = gradioApp().querySelector('#favouriteTempTxt > label > textarea');
    if (!favTempFolder) return;

    if (computedelem.color === "rgb(255, 255, 255)") {
        element.style.color = "#EBD617";
        applyValues(favTempFolder, folder + "/" + filename);
        if (addfavouritebtn) addfavouritebtn.click();
    } else {
        element.style.color = "#ffffff";
        applyValues(favTempFolder, folder + "/" + filename);
        if (removefavouritebtn) removefavouritebtn.click();
    }
}

function addQuicksave() {
    const ulElement = gradioApp().getElementById('styles_quicksave_list');
    if (!ulElement) return;

    var liElement = document.createElement('li');
    var deleteButton = document.createElement('button');
    var innerButton = document.createElement('button');
    var promptParagraph = document.createElement('button');
    var negParagraph = document.createElement('button');
    let prompt = "";
    let negprompt = "";

    if (promptPos && (promptPos.value !== "" || (promptNeg && promptNeg.value !== ""))) {
        if (promptPos.value == "") {
            promptParagraph.disabled = true;
            promptParagraph.textContent = "EMPTY";
            prompt = "EMPTY";
        } else {
            promptParagraph.disabled = false;
            promptParagraph.textContent = promptPos.value;
            prompt = encodeURIComponent(promptPos.value);
        }

        if (!promptNeg || promptNeg.value == "") {
            negParagraph.disabled = true;
            negParagraph.textContent = "EMPTY";
            negprompt = "EMPTY";
        } else {
            negParagraph.disabled = false;
            negParagraph.textContent = promptNeg.value;
            negprompt = encodeURIComponent(promptNeg.value);
        }

        liElement.className = 'styles_quicksave';
        deleteButton.className = 'styles_quicksave_del';
        deleteButton.textContent = '❌';
        deleteButton.onclick = function () {
            deletequicksave(this);
        };

        promptParagraph.onclick = function () {
            applyQuickSave("pos", this.textContent);
        };
        promptParagraph.onmouseenter = function () {
            event.stopPropagation();
            hoverPreviewStyle(promptParagraph.textContent, negParagraph.textContent, 'Quicksave');
        };
        promptParagraph.onmouseleave = function () {
            hoverPreviewStyleOut();
        };
        promptParagraph.className = 'styles_quicksave_prompt styles_quicksave_btn';

        negParagraph.onclick = function () {
            applyQuickSave("neg", this.textContent);
        };
        negParagraph.onmouseenter = function () {
            event.stopPropagation();
            hoverPreviewStyle(promptParagraph.textContent, negParagraph.textContent, 'Quicksave');
        };
        negParagraph.onmouseleave = function () {
            hoverPreviewStyleOut();
        };
        negParagraph.className = 'styles_quicksave_neg styles_quicksave_btn';

        innerButton.className = 'styles_quicksave_apply';
        innerButton.appendChild(promptParagraph);
        innerButton.appendChild(negParagraph);
        liElement.appendChild(deleteButton);
        liElement.appendChild(innerButton);
        ulElement.appendChild(liElement);
    }
}

function applyQuickSave(box, prompt) {
    tabname = getENActiveTab();
    if (box == "pos") {
        applyValues(promptPos, prompt);
    } else {
        applyValues(promptNeg, prompt);
    }
}

function deletequicksave(elem) {
    const quicksave = elem.parentNode;
    const list = quicksave.parentNode;
    if (list) {
        list.removeChild(quicksave);
    }
}

function clearquicklist() {
    const list = gradioApp().getElementById("styles_quicksave_list");
    if (!list) return;

    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
}

function sendToPromtbox(prompt) {
    tabname = getENActiveTab();
    promptPos = gradioApp().querySelector(`#${tabname}_prompt > label > textarea`);
    applyValues(promptPos, prompt);
}

function stylesgrabprompt() {
    tabname = getENActiveTab();
    promptPos = gradioApp().querySelector(`#${tabname}_prompt > label > textarea`);
    return promptPos ? promptPos.value : "";
}
