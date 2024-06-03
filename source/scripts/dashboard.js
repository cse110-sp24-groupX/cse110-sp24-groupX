const dateConversion = (date) => {
    const parts = date.split('-');
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    const year = parseInt(parts[0], 10);
    return `${month}-${day}-${year}`;
};

// Function to calculate consecutive day streak
function calculateConsecutiveDayStreak(entries) {
    if (entries.length === 0) return 0;

    // Sort entries by date
    entries.sort((a, b) => new Date(a.date) - new Date(b.date));

    let maxStreak = 0;
    let currentStreak = 1;

    for (let i = 1; i < entries.length; i += 1) {
        const prevDate = new Date(entries[i - 1].date);
        const currDate = new Date(entries[i].date);
        const diffInDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);

        if (diffInDays === 1) {
            currentStreak += 1;
        } else {
            if (currentStreak > maxStreak) {
                maxStreak = currentStreak;
            }
            currentStreak = 1;
        }
    }

    // Check last streak
    if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
    }

    return maxStreak;
}

function updateStreakImage(streakLength) {
    const streakImage = document.getElementById('streakImage');
    let imagePath = '';
    if (streakLength < 7) {
        streakImage.style.display = 'none';
    } else if (streakLength < 14) {
        imagePath = 'images/1is.png';
    } else if (streakLength < 21) {
        imagePath = 'images/2is.png';
    } else if (streakLength < 28) {
        imagePath = 'images/3is.png';
    } else if (streakLength < 35) {
        imagePath = 'images/4is.png';
    } else {
        imagePath = 'images/5is.png';
    }

    console.log('Setting image path to:', imagePath); // Debugging statement
    streakImage.src = imagePath;
}

(async () => {
    try {
        // Define the path to the JSON file
        const jsonPath = 'data/entries.json';

        // Read the JSON file
        const data = await window.api.readFile(jsonPath);
        console.log('Raw data:', data); // Debugging statement

        // Parse the JSON data
        const entries = JSON.parse(data);
        console.log('Parsed entries:', entries); // Debugging statement

        const container = document.getElementById('graph-container');
        const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const startDate = new Date();
        const monthIndex = startDate.getMonth();

        // Loop through the days of May
        for (let i = 0; i < daysInMonth[monthIndex - 1]; i += 1) {
            // Calculate the date for the current day
            const currentDate = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));

            const comparisonDate = dateConversion(currentDate.toISOString().split('T')[0]);
            // Check if the day exists in the entries
            const matchingEntries = entries.filter((entry) => entry.date === comparisonDate);
            const entryCount = matchingEntries.length;

            // Create a day square
            const square = document.createElement('div');
            square.classList.add('square');
            if (entryCount > 0) {
                if (entryCount >= 3) {
                    square.classList.add('most-active');
                } else if (entryCount === 2) {
                    square.classList.add('more-active');
                } else {
                    square.classList.add('active');
                }
            } else {
                square.classList.add('inactive');
            }

            // Append the square to the container
            container.appendChild(square);
        }

        const currentStreak = calculateConsecutiveDayStreak(entries);
        console.log('Calculated current streak:', currentStreak); // Debugging statement

        // Update streak image based on the current streak length
        updateStreakImage(currentStreak);
    } catch (err) {
        console.error('An error occurred while reading the JSON file:', err);
    }
})();

const modal = document.getElementById('myModal');
const img = document.getElementById('triggerPopup');
const span = document.getElementsByClassName('close')[0];
const container = document.querySelector('.container');

// Listens for when the dashboard button is clicked, to link to dashboard page
const dashboardButton = document.getElementById('dashboardLink');
dashboardButton.addEventListener('click', () => {
    // Link to dashboard here
    window.api.loadHtmlFile('calendar.html');
});