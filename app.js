// Selectors
const translator = document.querySelector(".translator");
const inputDropDownBox = document.querySelector("#input-dropdownbox");
const outputDropDownBox = document.querySelector("#output-dropdownbox");
const inputDropDownIcon = document.querySelector("#input-dropdown-icon");
const outputDropDownIcon = document.querySelector("#output-dropdown-icon");
const inputCountrysLanguages = document.querySelector(
  ".input-countrys-languages"
);
const outputCountrysLanguages = document.querySelector(
  ".output-countrys-languages"
);
const outPutText = document.querySelector("#output-text");
const inputText = document.querySelector("#input-text");
let currentlanguage = document.querySelector("#input-current-language");
let previouslanguage = document.querySelector("#input-previous-language");
let currLangBox = document.querySelector("#input-current-language-box");
let preLangBox = document.querySelector("#input-previous-language-box");
let outputCurrentlanguage = document.querySelector("#output-current-language");
let outputPreviouslanguage = document.querySelector(
  "#output-previous-language"
);
let outputCurrLangBox = document.querySelector("#output-current-language-box");
let outputPreLangBox = document.querySelector("#output-previous-language-box");
const inputBottomSection = document.querySelector(".input-bottom-section");
const outputBottomSection = document.querySelector(".output-bottom-section");
const swipedLanguage = document.querySelector("#swiper");
let outPutContainer = document.querySelector(".output-section");
let newTabIcon = document.querySelector(".output-tab");
const newTabIconTwo = document.querySelector("#swiper-new-tab");

// Global Variables
const languagesArray = [];
let isDropdownOpen = false;
let inputCurrLangCode;
let outPutCode;
let inputTextValue;
let outPutTextValue = outPutText.value;
let inputLanguagesGenerated = false;
let outPutLanguagesGenerated = false;
let isTabCopied = false;
let inputCurrentLanguageSelected;
let outPutCurrentLanguageSelected;
let inputPreviousLanguageSelected;
let outPutPreviousLanguageSelected;
let inputTimer;

// Update the output text with translated text
const updateOutputText = (translatedText) => {
  if (!inputTextValue && translatedText) {
    outPutText.innerText = "";
  } else {
    outPutText.innerText = translatedText;
  }
};

// Function to fetch translation data from API with error handling
const fetchTranslationData = async (
  inputLanguageCode,
  outPutLanguageCode,
  inputTextValue
) => {
  try {
    if (!inputLanguageCode || !outPutLanguageCode) {
      inputLanguageCode = defaultCurrInputLanguage;
      outPutLanguageCode = defaultCurrOutPutLanguage;
    }

    const url = `https://api.mymemory.translated.net/get?q=${inputTextValue}&langpair=${inputLanguageCode}|${outPutLanguageCode}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch translation data");
    }

    const translationData = await response.json();
    updateOutputText(translationData.responseData.translatedText);
  } catch (error) {
    console.error("Error fetching translation:", error);
    // You can show a user-friendly error message to the user if needed
  }
};

// Handle default translation settings
const handleDefaultTranslation = () => {
  if (!inputCurrLangCode && !outPutCode) {
    inputCurrLangCode = currentlanguage.getAttribute("data-language-code");
    outPutCode = outputCurrentlanguage.getAttribute("data-language-code");
  }

  previouslanguage.addEventListener("click", () => {
    currLangBox.classList.remove("curractive");
    currentlanguage.classList.remove("active");
    preLangBox.classList.add("curractive");
    previouslanguage.classList.add("active");
    inputCurrLangCode = previouslanguage.getAttribute("data-language-code");
  });

  currentlanguage.addEventListener("click", () => {
    currLangBox.classList.add("curractive");
    currentlanguage.classList.add("active");
    preLangBox.classList.remove("curractive");
    previouslanguage.classList.remove("active");
    inputCurrLangCode = currentlanguage.getAttribute("data-language-code");
  });

  outputPreviouslanguage.addEventListener("click", () => {
    outputCurrentlanguage.classList.remove("active");
    outputCurrLangBox.classList.remove("curractive");
    outputPreLangBox.classList.add("curractive");
    outputPreviouslanguage.classList.add("active");
    outPutCode = outputPreviouslanguage.getAttribute("data-language-code");
  });

  outputCurrentlanguage.addEventListener("click", () => {
    outputCurrentlanguage.classList.add("active");
    outputCurrLangBox.classList.add("curractive-border");
    outputPreLangBox.classList.remove("curractive");
    outputPreviouslanguage.classList.remove("active");
    outPutCode = outputCurrentlanguage.getAttribute("data-language-code");
  });
};

// Handle swapping languages
const handleSwapeLanguages = () => {
  let tempSelectedLanguage = currentlanguage.textContent;
  currentlanguage.textContent = outputCurrentlanguage.textContent;
  outputCurrentlanguage.textContent = tempSelectedLanguage;

  // Update the input and output language codes
  let tempLanguageCode = currentlanguage.getAttribute("data-language-code");
  currentlanguage.setAttribute(
    "data-language-code",
    outputCurrentlanguage.getAttribute("data-language-code")
  );
  outputCurrentlanguage.setAttribute("data-language-code", tempLanguageCode);
  swipedLanguage.classList.toggle("active");
  inputCurrLangCode = currentlanguage.getAttribute("data-language-code");
  outPutCode = outputCurrentlanguage.getAttribute("data-language-code");
};

// Fetch the list of languages if not already loaded
const fetchLanguages = () => {
  if (languagesArray.length === 0) {
    fetch("countries.json")
      .then((response) => response.json())
      .then((data) => {
        for (const code in data) {
          const name = data[code];
          languagesArray.push({ code, name });
        }
      });
  }
};

// Generate the list of input languages
const generateInputLanguages = () => {
  let inputLanguages = "";
  languagesArray.forEach((countrys) => {
    let name = countrys.name.name;
    let code = countrys.name.code;
    inputLanguages += `
        <div class="language">
          <span class="input-text" data-language-code="${code}">${name}</span>
        </div>`;
  });

  inputCountrysLanguages.innerHTML = inputLanguages;
};

// Generate the list of output languages
const generateOutPutLanguages = () => {
  let outputLanguages = "";
  languagesArray.forEach((countrys) => {
    let name = countrys.name.name;
    let code = countrys.name.code;

    outputLanguages += `
            <div class="language"  >
              <span class="output-text" data-language-code="${code}">${name}</span>
            </div>`;
  });

  // Update the dropdown with output languages
  outputCountrysLanguages.innerHTML = outputLanguages;
};

// Dropdown for input languages
const inputdropdown = () => {
  isDropdownOpen = !isDropdownOpen;

  if (isDropdownOpen) {
    inputDropDownIcon.style.transform = "scaleY(-1)";
    inputDropDownBox.style.display = "block";

    // Generate the list of input languages only if not already generated
    if (!inputLanguagesGenerated) {
      generateInputLanguages(); // Function to generate the list of input languages
      inputLanguagesGenerated = true;
    }
  } else {
    inputDropDownIcon.style.transform = "";
    inputDropDownBox.style.display = "none";
  }
};

// Dropdown for output languages
const outPutDropDown = () => {
  isDropdownOpen = !isDropdownOpen;

  if (isDropdownOpen) {
    outputDropDownIcon.style.transform = "scaleY(-1)";
    outputDropDownBox.style.display = "block";

    // Generate the list of output languages only if not already generated
    if (!outPutLanguagesGenerated) {
      generateOutPutLanguages(); // Function to generate the list of output languages
      outPutLanguagesGenerated = true;
    }
  } else {
    outputDropDownIcon.style.transform = "";
    outputDropDownBox.style.display = "none";
  }
};

// Change input language
const inputLanguageChanges = (selectedLanguage) => {
  inputCurrentLanguageSelected = selectedLanguage.textContent;
  inputCurrLangCode = selectedLanguage.getAttribute("data-language-code");
  currentlanguage.innerHTML = inputCurrentLanguageSelected;
  currentlanguage.setAttribute("data-language-code", inputCurrLangCode);
};

// Change output language
const outputLanguageChanges = (outputSelectedLanguage) => {
  outPutCurrentLanguageSelected = outputSelectedLanguage.textContent;
  outPutCode = outputSelectedLanguage.getAttribute("data-language-code");
  outputCurrentlanguage.innerHTML = outPutCurrentLanguageSelected;
  outputCurrentlanguage.setAttribute("data-language-code", outPutCode);
};

// Handle voice action for input text
const inputHandleVoiceAction = (inputTextValue) => {
  const userInputText = new SpeechSynthesisUtterance();
  userInputText.text = inputTextValue;
  window.speechSynthesis.speak(userInputText);
};

// Handle copy action for input text
const inputHandleCopyAction = (inputTextValue) => {
  navigator.clipboard.writeText(inputTextValue);
  alert("copied");
};

// Handle voice action for output text
const outputHandleVoiceAction = () => {
  let outPutTextValue = outPutText.value;
  const userInputText = new SpeechSynthesisUtterance();
  userInputText.text = outPutTextValue;
  window.speechSynthesis.speak(userInputText);
};

// Handle copy action for output text
const outputHandleCopyAction = () => {
  let outPutTextValue = outPutText.value;
  navigator.clipboard.writeText(outPutTextValue);
  alert("copied");
};

// Handle language font styling
const handleLanguageFonts = () => {
  if (outPutCode === "ur") {
    outPutText.classList.add("urdu-font");
  } else if (outPutCode === "hi" || outPutCode === "mr") {
    outPutText.classList.remove("urdu-font");
    outPutText.classList.add("hindi-font");
  } else {
    outPutText.classList.remove("urdu-font");
    outPutText.classList.remove("hindi-font");
  }
};

// Handle copy action for new tab 
handleCopyTab = () => {
  if (!isTabCopied) {
    let newTab = outPutContainer.cloneNode(true);
    translator.append(newTab);
    isTabCopied = true;
    newTabIconTwo.style.display = "block";
  }
};

// Set up event listeners
const handleEventListeners = () => {
  try {
    translator.addEventListener("click", (e) => {
      if (e.target.closest("#input-dropdown-icon")) {
        inputdropdown();
      }

      if (e.target.closest("#output-dropdown-icon")) {
        outPutDropDown();
      }
    });

    inputCountrysLanguages.addEventListener("click", (e) => {
      const selectedLanguage = e.target.closest(".input-text");
      const inputLanguageBox = e.target.closest(".input-text").parentNode;
      if (selectedLanguage) {
        inputLanguageChanges(selectedLanguage);
      }

      // Remove "curractive-box" class from the previously selected input language
      if (inputPreviousLanguageSelected) {
        inputPreviousLanguageSelected.classList.remove("curractive-box");
      }

      if (selectedLanguage) {
        inputLanguageBox.classList.add("curractive-box");
        inputPreviousLanguageSelected = inputLanguageBox;
      }
    });

    outputCountrysLanguages.addEventListener("click", (e) => {
      const outPutLanguageBox = e.target.closest(".output-text").parentNode;

      const outputSelectedLanguage = e.target.closest(".output-text");
      if (outputSelectedLanguage) {
        outputLanguageChanges(outputSelectedLanguage);
      }

      if (outPutPreviousLanguageSelected) {
        outPutPreviousLanguageSelected.classList.remove("curractive-box");
      }

      if (outputSelectedLanguage) {
        outPutLanguageBox.classList.add("curractive-box");
        outPutPreviousLanguageSelected = outPutLanguageBox;
      }
    });

    inputText.addEventListener("input", () => {
      clearTimeout(inputTimer);
      inputTimer = setTimeout(() => {
        inputTextValue = inputText.value;
        if (inputTextValue) {
          fetchTranslationData(inputCurrLangCode, outPutCode, inputTextValue);
        } else {
          handleDefaultTranslation();
        }
        if (outPutCode) {
          handleLanguageFonts();
        }
      }, 200);
    });

    swipedLanguage.addEventListener("click", () => {
      handleSwapeLanguages();
    });

    inputBottomSection.addEventListener("click", (e) => {
      if (inputTextValue) {
        if (e.target.matches("#input-sound-icon")) {
          inputHandleVoiceAction(inputTextValue);
        } else if (e.target.matches("#input-copy-icon")) {
          inputHandleCopyAction(inputTextValue);
        }
      }
    });

    outputBottomSection.addEventListener("click", (e) => {
      let outPutTextValue = outPutText.value;
      if (outPutTextValue) {
        if (e.target.matches("#output-sound-icon")) {
          outputHandleVoiceAction(outPutTextValue);
        } else if (e.target.matches("#output-copy-icon")) {
          outputHandleCopyAction(outPutTextValue);
        }
      }
    });

    newTabIcon.addEventListener("click", () => {
      handleCopyTab();
    });
  } catch (error) {
    console.log(error);
  }
};

// Call the necessary functions to set up the page
const initializePage = async () => {
  fetchLanguages();
  handleEventListeners();
  handleDefaultTranslation();
};

// Initialize the page
initializePage();
