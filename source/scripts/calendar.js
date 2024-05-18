/**
 * A reusable calendar widget
 * @class Calendar
 */
document.addEventListener("DOMContentLoaded", function () {
    const monthSelect = document.getElementById("month");
    const yearInput = document.getElementById("year");
    const calendarContainer = document.getElementById("calendar");
    const clearDataButton = document.getElementById('clearBtn');

    // Function to generate calendar
    function generateCalendar(month, year) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDay = new Date(year, month, 1).getDay();
      
      //calendarContainer.innerHTML, this generation will need to use local storage to make sure to generate appropriately
      //make sure to generate with all existing entries
      let calendarHTML = " <thead><tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr></thead><tbody></tbody><tr>";
  
      // Add empty cells for days before the first day of the month
      let count = 0;
      for (let i = 0; i < firstDay; i++) {
        calendarHTML += "<td id='emptyCell'></td> ";
        count++;
      }
  
      // Add cells for each day of the month
      for (let day = 1; day <= daysInMonth; day++) {
        if(count % 7 == 0){
            calendarHTML +=" </tr> <tr>";//creates a new ro
        }
        var fill;
        if(localStorage.getItem(month+'/'+day+'/'+year) == null){
          fill = day;
        }
        else{
          fill = localStorage.getItem(month+'/'+day+'/'+year);
        }
        calendarHTML += `<td id='standardCell' class='mouseOut `+(month+1)+'/'+day+'/'+year+`'  >`+fill+`</td> `;
        count++;
      }
      calendarHTML += "</tr></tbody>";
      calendarContainer.innerHTML = calendarHTML;
    }

  
    // Event listener for month and year change
    function updateCalendar() {
      const selectedMonth = parseInt(monthSelect.value);
      const selectedYear = parseInt(yearInput.value);
      generateCalendar(selectedMonth, selectedYear);
    }
  
    monthSelect.addEventListener("change", updateCalendar);
    yearInput.addEventListener("input", updateCalendar);

    
    // Defualt date set to current date
    document.addEventListener("DOMContentLoaded", function () {
      yearInput = document.getElementById("year");

      // Set current year as the initial value
      const currentYear = new Date().getFullYear();
      yearInput.value = currentYear.toString();
    });

    // Generate calendar on page load, with current date set to default
    updateCalendar();
  
    // Event listener for hover on day
    calendarContainer.addEventListener("mouseover", function (event) {
      const target = event.target;
      console.log(target);

      //target.classList.contains("standardCell")
      if (target.getAttribute('id') == "standardCell") {
        target.classList.remove("mouseOut");
        target.classList.add("mouseIn");
  
        //pull day from the cell clicked
        const classPattern = /^\d/;
        //var list = JSON.parse(target.classList);
        var dayDate;
        for(let i = 0; i < target.classList.length; i++){
          if(classPattern.test(target.classList[i])){
            const parts = target.classList[i].split('/');
            dayDate = parts[1];
          }
        }
        
        //testing
        console.log(target.classList);
        console.log("dayDate value: " + dayDate);

        // When user clicks on specific day cell to open modal window
        target.addEventListener('click', function (event) {
          
          // pull elements from HTML for the modal window
          var modal = document.getElementById("myModal");
          var span = document.getElementsByClassName("close")[0];
          var text = document.getElementById("modalTxt");
          var saveMarkDown = document.getElementById("save-markdown");
          var date = document.getElementById("month").value+'/'+dayDate+'/'+document.getElementById("year").value;
          modal.style.display = "block";
          //show date on the modals inner html (top left)
          text.innerHTML = date;
          // When the user clicks on <span> (x), close the modal
          span.onclick = function() {
            modal.style.display = "none";
          }
          //look for user input in the title
          var title = document.getElementById("entryTitle");
          // textBoxForTitle.addEventListener("input", (event)=>{
          //     console.log(event.data);
          //     console.log(event.value);
          //   });
          //When we click save, close the pop up, add local storage data (New entry title), update Calendar
          saveMarkDown.onclick = function(){
            
            if(title.value == ''){
              alert('You must add a title!');
            }
            else if(title.value.includes('.')){
            
              alert('Cannot use "." symbol within title, please update your title');
            }
            else{
              // We enter this else if we are ready to close and save
              modal.style.display = "none";
              var cell = document.getElementsByClassName(text.innerHTML);
              console.log(cell);//testing
            
              //cell.innerHTML = dayDate+"Text";
              console.log('The inner html:', cell.innerHTML);
              console.log('Class to use for key of local storage:', document.getElementById("month").value+'/'+dayDate+'/'+document.getElementById("year").value);
              let localStorageFill = localStorage.getItem(date);
              if(localStorageFill == null){
                localStorageFill = dayDate+"<button id="+title.value+">"+title.value+"</button>";
              }else{
                //remember to prevent users from naming events the same title
                // console.log("localstorageFill value: " + localStorageFill.value);
                if (localStorageFill.includes("id="+title.value+"")){
                  alert("An entry already exists with this name.");
                }else{
                  localStorageFill += "<button id="+title.value+">"+title.value+"</button>";
                }
              }
              localStorage.setItem(date, localStorageFill );// &&& CHANGE KEY TO HAVE BOTH DATE AND ENTRY TITLE
              updateCalendar();
            }
          }
    
          // When the user clicks anywhere outside of the modal, close it
          window.onclick = function(event) {
            if (event.target == modal) {
              modal.style.display = "none";
            }
          }
        });

        
      }
    });

    //clear button
    clearDataButton.addEventListener('click', function(event){
      localStorage.clear();
      updateCalendar();
    });
    
    

  
    calendarContainer.addEventListener("mouseout", function (event) {
      const target = event.target;
      if (target.getAttribute('id') == "standardCell") {
        target.classList.remove("mouseIn");
        target.classList.add("mouseOut");
        //target.style.background = '#af8181';
        // Remove buttons for tasks and markdown entries
        const taskButton = target.querySelector(".task-button");
        if (taskButton) {
          target.removeChild(taskButton);
        }
  
        const markdownButton = target.querySelector(".markdown-button");
        if (markdownButton) {
          target.removeChild(markdownButton);
        }
      }
    });
  });
  
