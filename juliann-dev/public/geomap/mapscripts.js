/*
GeoMap HTML 
ICS4U-01
Ariel Liu, Emma Guo, Juliann Zhu
This file functions as the main Javascript for the backend elements of GeoMap, a web application designed to help students study the IB Geography course.

History:
Jan 26, 2024: File creation
Jan 30, 2024: SVG map implementation, labelCountries() function
Feb 6, 2024: Clickable map with country names appearing
Feb 14, 2024: Legend creation, functions to change colour of countries when checkboxes are clicked
Feb 26, 2024: Function for zooming in and zooming out
Mar 5, 2024: CaseStudy class for information storage 
Apr 22, 2024: CaseStudy class updates to attributes and static functions
*/

/**
 * @author Ariel Liu - Case study class and functions, country labels, functions to display legend filter by colour
 * @author Juliann Zhu - Zooming functions, functions to change legend width, title screen animation
 * @author Emma Guo - Functions to display colour changes and label countries
 */

// COUNTRY LABELS -------------------------------------------------------------------------------

/**
 * Displays the label for the country names next to cursor when hovering over country.
 * Args: none
 * Returns: none
 */
function labelCountries() {
  // loop through all countries to detect if the move is hovering over it [1]
  document.querySelectorAll(".allPaths").forEach((e) => {
    e.addEventListener("mouseover", function () {
      // detect mouse movement and show text label
      window.onmousemove = function (j) {
        let x = j.clientX;
        let y = j.clientY;
        document.getElementById("name").style.top = y - 60 + "px";
        document.getElementById("name").style.left = x + 10 + "px";
      };
      document.getElementById("name").style.opacity = 1;
      document.getElementById("namep").innerText = e.id;
    });

    e.addEventListener("mouseleave", function () {
      document.getElementById("name").style.opacity = 0;
    });
  });
}

// CHECKBOX COLOUR DISPLAY -------------------------------------------------------------------------------

/**
 * Changes the country colour on the map when the Changing Population unit is checked in the legend.
 * Args: none
 * Returns: none
 */
function displayChangingPop() {
  var checkBox = document.getElementById("changingPopCheckbox");

  // check if the correct checkbox is clicked, then change the corresponding colours of the countries on map based on the class selected [1], [2]
  if (checkBox.checked == true) {
    document.querySelectorAll(".ChangingPop").forEach((e) => {
      e.style.fill = "hotpink";
      e.addEventListener("mouseover", function () {
        e.style.fill = "#a81980";
      });

      e.addEventListener("mouseleave", function () {
        e.style.fill = "hotpink";
      });
    });
  } else {
    // fill back with colour of map
    document.querySelectorAll(".ChangingPop").forEach((e) => {
      e.style.fill = "#1e613c";
      e.addEventListener("mouseover", function () {
        e.style.fill = "green";
      });

      e.addEventListener("mouseleave", function () {
        e.style.fill = "#1e613c";
      });
    });
  }
}

// repeat functions for different units to filter countries

/**
 * Changes the country colour on the map when the Urban Environments unit is checked in the legend.
 * Args: none
 * Returns: none
 */
function displayUrbanEnvironments() {
  var checkBox = document.getElementById("urbanEnviCheckbox");

  if (checkBox.checked == true) {
    document.querySelectorAll(".UrbanEnvironments").forEach((e) => {
      e.style.fill = "yellow";
      e.addEventListener("mouseover", function () {
        e.style.fill = "#e3b920";
      });

      e.addEventListener("mouseleave", function () {
        e.style.fill = "yellow";
      });
    });
  } else {
    // fill back with colour of map
    document.querySelectorAll(".UrbanEnvironments").forEach((e) => {
      e.style.fill = "#1e613c";
      e.addEventListener("mouseover", function () {
        e.style.fill = "green";
      });

      e.addEventListener("mouseleave", function () {
        e.style.fill = "#1e613c";
      });
    });
  }
}

/**
 * Changes the country colour on the map when the Global Climate unit is checked in the legend.
 * Args: none
 * Returns: none
 */
function displayGlobalClimate() {
  var checkBox = document.getElementById("globalClimateCheckbox");

  if (checkBox.checked == true) {
    document.querySelectorAll(".GlobalClimate").forEach((e) => {
      e.style.fill = "cyan";
      e.addEventListener("mouseover", function () {
        e.style.fill = "#04bdc7";
      });

      e.addEventListener("mouseleave", function () {
        e.style.fill = "cyan";
      });
    });
  } else {
    // fill back with colour of map
    document.querySelectorAll(".GlobalClimate").forEach((e) => {
      e.style.fill = "#1e613c";
      e.addEventListener("mouseover", function () {
        e.style.fill = "green";
      });

      e.addEventListener("mouseleave", function () {
        e.style.fill = "#1e613c";
      });
    });
  }
}

/**
 * Changes the country colour on the map when the Food and Health unit is checked in the legend.
 * Args: none
 * Returns: none
 */
function displayFoodHealth() {
  var checkBox = document.getElementById("foodHealthCheckbox");

  if (checkBox.checked == true) {
    document.querySelectorAll(".FoodHealth").forEach((e) => {
      e.style.fill = "#b026ff";
      e.addEventListener("mouseover", function () {
        e.style.fill = "#de89ff";
      });

      e.addEventListener("mouseleave", function () {
        e.style.fill = "#b026ff";
      });
    });
  } else {
    // fill back with colour of map
    document.querySelectorAll(".FoodHealth").forEach((e) => {
      e.style.fill = "#1e613c";
      e.addEventListener("mouseover", function () {
        e.style.fill = "green";
      });

      e.addEventListener("mouseleave", function () {
        e.style.fill = "#1e613c";
      });
    });
  }
}

// NAV BAR -------------------------------------------------------------------------------
// based on code from [3] and [4]

/**
 * Opens navigation bar when hamburger icon is clicked
 * Args: none
 * Returns: none
 */
function openNav() {
  document.getElementById("mySidenav").style.width = "375px";
}

/**
 * Closes navigation bar when close icon is clicked
 * Args: none
 * Returns: none
 */ function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

// CLASS FOR CASE STUDIES -------------------------------------------------------------------------------
// learned how to use proper class conventions, properties, and methods from [5] and [6]
/** @class CaseStudy representing a case study */
class CaseStudy {
  /**
   * Creates a case study object with the informational characteristics of a case study.
   * @author: Ariel
   * @param {string} unit: the unit that the case study belongs to
   * @param {string} name: the name of the case study
   * @param {list} info: the specific information in the case study
   * @param {list} quickfacts: the bullet points of short facts (to be more aesthetically displayed)
   * @param {string} img: the image source that should be associated with the case study - optional
   * @param {string} graph: the interactive graph source that should be associated with the case study - optional
   */
  constructor(unit, name, info, quickfacts, img = "", graph = "") {
    /** @private */ this._unit = unit;
    /** @private */ this._name = name;
    /** @private */ this._info = info;
    /** @private */ this._quickfacts = quickfacts;
    /** @private */ this._img = img;
    /** @private */ this._graph = graph;
  }

  /**
   * Sets the unit of the case study.
   * @param {string} newUnit: the new unit of case study that is set
   */
  set unit(newUnit) {
    this._unit = newUnit;
  }

  /**
   * Returns the unit of the case study
   */
  get unit() {
    return this._unit;
  }

  /**
   * Sets the name of the case study.
   * @param {string} newName: the new name of case study that is set
   */
  set name(newName) {
    this._name = newName;
  }

  /**
   * Returns the name of the case study
   */
  get name() {
    return this._name;
  }

  /**
   * Sets the information of the case study.
   * @param {string} newinfo: the new info of case study that is set
   */
  set info(newInfo) {
    this._info = newInfo;
  }

  /**
   * Returns the info of the case study
   */
  get info() {
    return this._info;
  }

  /**
   * Sets the bullet point facts of the case study.
   * @param {string} newQF: the new quick facts of case study that are set
   */
  set quickfacts(newQF) {
    this._quickfacts = newQF;
  }

  /**
   * Returns the quick facts of the case study
   */
  get quickfacts() {
    return this._quickfacts;
  }

  /**
   * Sets the image link of the case study.
   * @param {string} newImg: the new info of case study that is set
   */
  set img(newImg) {
    this._img = newImg;
  }

  /**
   * Returns the image link of the case study
   */
  get img() {
    return this._img;
  }

  /**
   * Sets the graph link of the case study
   */
  set graph(newGraph) {
    this.graph = newGraph;
  }

  /**
   * Returns the graph link of the case study
   */
  get graph() {
    return this._graph;
  }

  // the following class methods all use the method to add html elements dynamically with javascript, learned through the resource [7]
  /**
   * Static method that inserts the title for the case study.
   * @param {string} country: the corresponding country clicked
   * @returns {div} titleDiv: a div element that contains the case study title
   */
  static insertTitle(country) {
    // creates a div to be displayed in html
    const titleDiv = document.createElement("div");
    titleDiv.className = "title-div";
    const title = document.createTextNode(
      // use stored information database and class attributes to display correct information [8]
      caseStudiesMap.get(country).name.toUpperCase()
    );
    titleDiv.appendChild(title);
    return titleDiv;
  }

  /**
   * Static method that inserts the text sections for the case study
   * @param {string} country: the corresponding country clicked
   * @param {int} divNumber: the corresponding information section to be displayed
   * @returns {div} P1div: a div element that contains the case study information
   */
  static insertDiv(country, divNumber) {
    // creates a div to be displayed in html
    const P1div = document.createElement("div");
    P1div.className = "window-div";
    const windowP1 = document.createTextNode(
      // use stored information database and class attributes to display correct information [8]
      caseStudiesMap.get(country).info[divNumber]
    );
    P1div.appendChild(windowP1);
    return P1div;
  }

  /**
   * Static method that inserts the bullet point sections for the case study
   * @param {string} country: the corresponding country clicked
   * @param {int} divNumber: the corresponding information section to be displayed
   * @returns {div} infoDiv: a div element that contains the case study information
   */
  static insertBP(country, divNumber) {
    // bullet points - following code modified from generated code by ChatGPT [9], [10]. needed help coming up with code for the frontend display of the window, showing indented bullet points based on symbols from a string input. Initial code that led to the AI generated output was based off knowledge learned from [11], [12] and [13].
    const infoDiv = document.createElement("div");
    infoDiv.className = "window-div";

    let bulletpoints = caseStudiesMap.get(country).quickfacts[divNumber];
    var bp = bulletpoints.split("@");

    bp.forEach((liTxt) => {
      let li = document.createElement("li");
      let indentation = 0;

      // check for indentation symbol (e.g., '\t')
      while (liTxt.charAt(0) === "^") {
        indentation++;
        liTxt = liTxt.substring(1);
      }

      let boldParts = liTxt.split("*");
      liTxt = boldParts.shift(); // remove empty string from split result
      while (boldParts.length > 0) {
        let boldText = boldParts.shift();
        let boldElement = document.createElement("b");
        boldElement.textContent = boldText;
        liTxt += boldElement.outerHTML + boldParts.shift();
      }

      // apply indentation using CSS margin-left property
      li.style.marginLeft = `${indentation * 40}px`;

      li.innerHTML = liTxt;
      infoDiv.appendChild(li);
    });

    return infoDiv;
  }

  /**
   * Static method that inserts the graphics for the case study
   * @param {string} country: the corresponding country clicked
   * @returns {div} imgDiv: a div element that contains the graph and image in a column
   */
  static insertGraphics(country) {
    // image section - used elements from code in [14]

    // main graphics div
    const imgDiv = document.createElement("div");
    imgDiv.id = "img-div";

    // create image and div to contain it
    const div1 = document.createElement("div");
    div1.className = "graphics-div";
    let img = document.createElement("img");
    div1.append(img);
    img.id = "caseStudyImage";
    img.src = caseStudiesMap.get(country).img;
    img.alt = "case study image";

    // create graph and div to contain it
    const div2 = document.createElement("div");
    div2.className = "graphics-div";
    let graph = document.createElement("iframe");
    div2.append(graph);
    graph.id = "graphObject";
    graph.src = caseStudiesMap.get(country).graph;
    graph.alt = "case study graph";

    // append columns to row
    imgDiv.append(div1);
    imgDiv.append(div2);

    return imgDiv;
  }
}

// ZOOM FUNCTION ============================================================================
// based off knowledge and code learned from [15]

/**
 * Zoom in when zoom in button is clicked
 * Args: none
 * Returns: none
 */
function zoomIn() {
  var map = document.getElementById("map");
  var width = map.clientWidth;
  map.style.width = width + 100 + "px";
}

/**
 * Zoom out when zoom out button is clicked
 * Args: none
 * Returns: none
 */
function zoomOut() {
  var map = document.getElementById("map");
  var width = map.clientWidth;
  map.style.width = width - 100 + "px";
}

// Link zooming of map to the mouse scrolling action
// document.addEventListener("wheel", function (e) {
//   if (e.deltaY > 0) {
//     zoomOut();
//   } else {
//     zoomIn();
//   }
// });

// WELCOME SCREEN ======================================================================

function fade() {
  var titleScreen = document.getElementById("titleScreen");
  titleScreen.style.animation = "ease-out 10s forwards";
  titleScreen.style.display = "none";
}

/**Reference List
[1] Techy Web Dev, “Make a SVG world map to tell the time of every country | html, css & javascript,” www.youtube.com, Dec. 06, 2022. https://www.youtube.com/watch?v=WtoyIiOp5Aw (accessed Feb. 02, 2024).
[2] R. Moll, “Changing svg shape color on checkbox click,” Stack Overflow, Nov. 20, 2021. https://stackoverflow.com/questions/70048598/changing-svg-shape-color-on-checkbox-click (accessed Feb. 15, 2024).
[3] W3Schools, “How To Create a Side Navigation Menu,” W3schools.com, 2019. https://www.w3schools.com/howto/howto_js_sidenav.asp (accessed Feb. 15, 2024).
[4] Gaurav, “Let’s build a responsive navbar and hamburger menu using HTML, CSS, and Javascript.,” DEV Community, Mar. 13, 2021. https://dev.to/devggaurav/let-s-build-a-responsive-navbar-and-hamburger-menu-using-html-css-and-javascript-4gci (accessed Feb. 16, 2024).
[5] MDN web docs, “Classes,” MDN Web Docs, Dec. 09, 2019. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes (accessed Feb. 15, 2024).
[6] K. Paralkar, “JavaScript Classes – How They Work with Use Case Example,” freeCodeCamp.org, Dec. 13, 2021. https://www.freecodecamp.org/news/javascript-classes-how-they-work-with-use-case/ (accessed Mar. 01, 2024).
[7] Geeks For Geeks, “How to create an image element dynamically using JavaScript ?,” GeeksforGeeks, Sep. 05, 2019. https://www.geeksforgeeks.org/how-to-create-an-image-element-dynamically-using-javascript/ (accessed Apr. 15, 2024).
[8] A. E. D’Silva, “How to create a JavaScript Dictionary? | Flexiple Tutorials | JavaScript,” Flexiple, Feb. 22, 2024. https://flexiple.com/javascript/javascript-dictionary (accessed Feb. 19, 2024).
[9] OpenAI, San Francisco, USA. 2023. ChatGPT-4. Available: https://openai.com/gpt-4
[10] ChatGPT, response to prompt “act as a backend software developer for javascript, html, and css to help solve a coding issue for an html project. the following code separates a string of text separated by the symbol "@" and displays it as unordered list elements on html.

for example, given the string: The areas of greatest deprivation in barcelona occur in 2 main locations:@The inner city areas (ex: El Raval):@Deprivation in these areas coincides with areas of old and substandard housing built during the industrial revolution to house factory workers@Towards the city’s edge:
the code would show on the html, an unordered list with bullet points before each line separated by the "@" symbol. 

the code to do this is:
let bulletpoints = caseStudiesMap.get(country).quickfacts;
            var bp = bulletpoints.split("@");
            let ul = document.querySelector("#mycontent")
            bp.forEach(liTxt => {
                let li = document.createElement("li");
                li.innerHTML = liTxt;
                ul.appendChild(li);
            });

i want to create the possibility of indented bullet points being displayed in the html. therefore, i need a method to reformat the string given in a certain way (maybe with another symbol) to indicate to the program that an indented list element is needed for the specific line”. OpenAI [Online]. https://chatgpt.com/ (accessed April 17, 2024).
[11] J. Burns, “How to Create Indents and Bullet Lists,” HTML Goodies, Jan. 04, 2005. https://www.htmlgoodies.com/getting-started/so-you-want-indents-and-lists-huh/ (accessed Apr. 17, 2024).
[12] Mpsteve137, “How can I display bullet points properly from a string?,” Stack Overflow, Jan. 18, 2021. https://stackoverflow.com/questions/65782965/how-can-i-display-bullet-points-properly-from-a-string (accessed Apr. 17, 2024).
[13] ornulf2001, “How can i make my new bullet points display a string?,” Stack Overflow, Nov. 22, 2018. https://stackoverflow.com/questions/53432310/how-can-i-make-my-new-bullet-points-display-a-string (accessed Apr. 29, 2024).
[14] A. De Forest, “Adding an img element to a div with javascript,” Stack Overflow, Oct. 18, 2011. https://stackoverflow.com/questions/7802744/adding-an-img-element-to-a-div-with-javascript (accessed Apr. 29, 2024).
[15] A. Mannan, “How to Zoom-in and Zoom-out Image Using JavaScript?,” Linux Hint, 2022. https://linuxhint.com/image-zoom-in-zoom-out-javascript/ (accessed Feb. 26, 2024).
 */
