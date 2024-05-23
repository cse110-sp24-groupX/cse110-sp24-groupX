/**
 * updateCellLocalStorage 
 *
 * @function 
 * @param {string} cell - the namespace and name of the event
 * @param {string} eventToDelete - the id of the event
 *                  Deletes a designated button from the HTML.
 */
function updateCellLocalStorage(cell, eventToDelete){
  let data = localStorage.getItem(cell);
  let dataArray = data.split("</button> ");
  if(dataArray.length == 1){
    //in the case that there was only the one button we just clear everything
    console.log("We have one button, so we clear out the cell");
    localStorage.removeItem(cell);
    return;
  }
  let updatedData = "";
  let length = dataArray.length;
  for(let i = 0; i < length; i += 1){
    let current = dataArray[i];
    console.log("This is the value of current", current);
    if (current === `<button class='entryButton' id=${eventToDelete}>${eventToDelete.split(".")[0]}`){
      //we have found the part we want to delete
      //dont do anything
    }
    else{
      updatedData += current+"</button>";
    }
  }
  localStorage.setItem(cell, updatedData);
}

// &&& need to implement a third "..." redirect button and corresponding modal window
/**
 * Listen for DOMContentLoaded
 *
 * @type {document} - the target of the event
 * @listens document#DOMContentLoaded - the namespace and name of the event
 */
document.addEventListener('DOMContentLoaded', () => {
    const monthSelect = document.getElementById('month');
    let yearInput = document.getElementById('year');
    const calendarContainer = document.getElementById('calendar');
    const clearDataButton = document.getElementById('clearBtn');
    const entryButtons = document.getElementsByClassName('entryButton');
    // Set current month and year as initial values
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // Month is zero-based
    const currentYear = currentDate.getFullYear();

    // Set initial values for month and year inputs
    monthSelect.value = currentMonth.toString();
    yearInput.value = currentYear.toString();

    /**
     * generateCalendar - generate the Calendar by inserting HTML into main.
     * @function
     *                  It modifies the HTML to create the calendar layout.
     */
    function generateCalendar() {
        const month = parseInt(monthSelect.value, 10);
        const year = parseInt(yearInput.value, 10);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();

        // Start with adding top row, days of the week
        let calendarHTML = '<thead><tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr></thead><tbody></tbody><tr>';

        // Add empty cells for days before the first day of the month
        let count = 0;
        for (count = 0; count < firstDay; count += 1) {
            calendarHTML += "<td id='emptyCell'></td> ";
        }

        // Add cells for all other days of the month
        for (let day = 1; day <= daysInMonth; day += 1) {
            // (condition) ? expression on true : expression on false
            if (count % 7 === 0) {
                calendarHTML += ' </tr> <tr>';// creates a new row
            }
            let fill;
            const memory = localStorage.getItem(`${month +1}/${day}/${year}`);
            // check what was stored for that day
            if (memory === null) {
                fill = day;
            } else {
                fill = day + memory;
            }
            calendarHTML += `<td id='${month + 1}/${day}/${year}' class='mouseOut standardCell'  >${fill}</td> `;
            count += 1;
        }
        calendarHTML += '</tr></tbody>';
        calendarContainer.innerHTML = calendarHTML;
    }

    monthSelect.addEventListener('change', generateCalendar);
    yearInput.addEventListener('input', generateCalendar);

    // Generate calendar on page load, with current date set to default
    generateCalendar();

    /**
     * openModal - will open up a modal window with text box and title box
     * @function
     *                  allow users to make entries
     */
    function openModal(event) {
        console.log('you opened the modal');// test to see if we're clicking through our buttons
        console.log('this is the id of what you clicked on', event.target.id);
        console.log('this is the class what you clicked on:', event.target.classList);
        let infoArray = event.target.id.split(".");
        let name = null;
        let date;
        
        if(infoArray.length === 2){
          //this means we are working with existing event
          [name, date] = infoArray;
        }
        else{
          [date] = infoArray;
        }
        // let [possibleName, dayDate] = event.target.id.split("/");
        // let name;

        //event.target.id is either... name4/2/2003 <-this is on clicking on saved event
        //or it may be 4/2/2003 <-this is clicking on empty cell
        //(4/2/2003, <buttons class= enteryBUtton id=name4/2/2003><\buttons id=name2><buttons><\buttons><buttons><\buttons>)
        //(name4/2/2003, textEntry Value whatever the user typed in)
        //therefore possibleName can either be name4 or 4 depending on if we clicked
        //we need to identify if user clicked on a old event, or is creating a new one
        //if they clicked on an old event, we should include new option, delete button
        //we should also make the name of the event unchangable, or at least ask for a confirmation


        // pull elements from HTML for the modal window
        const modal = document.getElementById('myModal');
        const span = document.getElementsByClassName('close')[0];
        const text = document.getElementById('modalTxt');
        const saveMarkDown = document.getElementById('save-markdown');
        const markdownInput = document.getElementById('markdown');
        //const date = `${document.getElementById('month').value}/${dayDate}/${document.getElementById('year').value}`;
        const title = document.getElementById('entryTitle');

        if (name === null) {
            // clear out all old data
            markdownInput.value = null;
            title.value = null;
        } else {
            // reenter old data
            //we need to make a button
            markdownInput.value = localStorage.getItem(event.target.id);
            title.value = event.target.innerHTML;
        }

        modal.style.display = 'block';
        // show date on the modals inner html (top left)
        text.innerHTML = date;
        if(name != null){
          text.innerHTML += "<button id=\'deleteEntryButton\'>Delete Entry</button>";//add class here for styling?
          const deleteEntryButton = document.getElementById("deleteEntryButton");
          deleteEntryButton.addEventListener('click', ()=>{
            //should add a confirm choice to make sure it wasnt misclick
            localStorage.removeItem(event.target.id);//this clears the entry
            //what if we split by </button> and then get rid of the one that starts with <button id = event.target.id>
            //then update using setItem, and put our new string
            //do we make a helper function?
            //date is the id of the cell we are updating, and event.target.id is the id of the button we are removing
            updateCellLocalStorage(date, event.target.id);
            modal.style.display = 'none';
            generateCalendar();
          });
        }
        // When the user clicks on <span> (x), close the modal
        span.onclick = () => {
            modal.style.display = 'none';
        };


        // look for user input in the title

        // When we click save, close the pop up,
        // add local storage data (New entry title), re-generateCalendar
        /*
        * Listens for click of the saveMarkDown button.
        *
        * @type {HTMLElement} - the target of the event, being the save button
        */
        saveMarkDown.onclick = () => {
            if (title.value === '') {
                alert('You must add a title!'); // eslint-disable-line no-alert
            } else if (title.value.includes('.') || title.value.includes(' ')) {
                alert('Cannot use "." symbol or spaces within title, please update your title'); // eslint-disable-line no-alert
            } else {
                // We enter this else if we are ready to close and save
                modal.style.display = 'none';

                let localStorageFill = localStorage.getItem(date);
                if (localStorageFill === null) {
                    localStorageFill = `<button class='entryButton' id=${title.value}.${date}>${title.value}</button>`;
                } else if (localStorageFill.includes(`id=${title.value}.${date}`)) {
                    alert('An entry already exists with this name.'); // eslint-disable-line no-alert
                } else {
                    localStorageFill += `<button class='entryButton' \
                  id=${title.value}.${date}>${title.value}</button>`;
                }
                localStorage.setItem(date, localStorageFill);
                localStorage.setItem(title.value+"."+ date, markdownInput.value);
                generateCalendar();
            }
        };

        /*
        * Listens for click outside of modal window, closes if detected
        *
        * @type {HTMLElement} - the target of the event, being outside the modal
        */
        window.onclick = (modalOutsideClick) => {
            if (modalOutsideClick.target === modal) {
                modal.style.display = 'none';
            }
        };
    }

    // This is when we hover over some calendar cell
    /*
        * Listens for mouseover of the calendar button.
        *
        * @type {HTMLElement} - the target of the event, being the save button
        */
    calendarContainer.addEventListener('mouseover', (event) => {
        console.log('Some mouse hover event happened');
        const { target } = event;

        // target.classList.contains("standardCell")
        if (target.classList.contains('standardCell')) {
            console.log('hovered over something');
            target.classList.remove('mouseOut');
            target.classList.add('mouseIn');

            // When user clicks on specific day cell to open modal window
            target.addEventListener('click', (dayCell) => openModal(dayCell));
        }
    });

    // clear button
    clearDataButton.addEventListener('click', () => {
        localStorage.clear();
        generateCalendar();
    });

    calendarContainer.addEventListener('mouseout', (event) => {
        const { target } = event;
        if (target.classList.contains('standardCell')) {
            target.classList.remove('mouseIn');
            target.classList.add('mouseOut');
            const taskButton = target.querySelector('.task-button');
            if (taskButton) {
                target.removeChild(taskButton);
            }

            const markdownButton = target.querySelector('.markdown-button');
            if (markdownButton) {
                target.removeChild(markdownButton);
            }
            for (let i = 0; i < entryButtons.length; i += 1) {
                entryButtons[i].addEventListener('click', (entryButtonClick) => {
                    console.log(`This is the entry button you just clicked:${entryButtons[i].id}this is the index:${i}`); // &&& Keeps logging way too many clicks
                    // this is to prevent the cell under from being clicked after we click a button
                    entryButtonClick.stopPropagation();
                    openModal(entryButtonClick);
                });
            }
        }
    });
});
