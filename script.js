import {getmember_names, getmember_data, add_member_to_fb} from "./apifb.js";
// const members = [
//     'Kartik.json', 'AbhinavD.json', 'Ankita.json', 'Astha.json', 'Lakshay.json', 'Pranav.json',
//     'Shashwat.json', 'Sneha.json', 'VidushiD.json', 'Aditya.json', 'AnshikaD.json',
//     'Atul.json', 'Mahak.json', 'Ritik.json', 'Shivang.json', 'Sugandhi.json',
//     'Vinay.json', 'AkshatD.json', 'Arjun.json', 'Ayush.json', 'Naitik.json',
//     'Ritika.json', 'ShivaniD.json', 'Tanisha.json', 'Yash.json', 'Amulya.json',
//     'Arnav.json', 'Dikshant.json', 'Navneet.json', 'Sanvi.json', 'Shivansh.json',
//     'Tanishka.json', 'Yashvi.json', 'Anchal.json', 'Arpit.json', 'FaizalD.json',
//     'Navya.json', 'Saumyal.json', 'Shreyaa.json', 'Tushar.json',
//     'Anish.json', 'Aryan.json', 'Khushi.json', 'Neha.json', 'Shailja.json',
//     'Siddhartha.json', 'VanshD.json', 'yuga.json', 'Rohit.json','hathaipach.json',
//     'Maninder.json','JaydeepRawat.json'
// ];
const members = await getmember_names();

// Dark Mode Toggle
const toggleButton = document.getElementById('dark-mode-toggle');

function enableDarkMode() {
    document.body.classList.add('dark-mode');

    const cards = document.querySelectorAll('.card');
    cards.forEach((card) => {
        card.classList.add('dark-mode');
    });

    const headings = document.querySelectorAll('h3');
    headings.forEach((heading) => {
        heading.classList.add('dark-mode');
    });

    const h1Elements = document.querySelectorAll('h1');
    h1Elements.forEach((h1) => {
        h1.classList.add('dark-mode');
    });

    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach((p) => {
        p.classList.add('dark-mode');
    });

    const links = document.querySelectorAll('a');
    links.forEach((link) => {
        link.classList.add('dark-mode');
    });
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');

    const cards = document.querySelectorAll('.card');
    cards.forEach((card) => {
        card.classList.remove('dark-mode');
    });

    const headings = document.querySelectorAll('h3');
    headings.forEach((heading) => {
        heading.classList.remove('dark-mode');
    });

    const h1Elements = document.querySelectorAll('h1');
    h1Elements.forEach((h1) => {
        h1.classList.remove('dark-mode');
    });

    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach((p) => {
        p.classList.remove('dark-mode');
    });

    const links = document.querySelectorAll('a');
    links.forEach((link) => {
        link.classList.remove('dark-mode');
    });
}


// Function to apply dark mode based on localStorage preference
function applyDarkModePreference() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true'; // Check if dark mode is enabled

    if (isDarkMode) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
}



// Toggle dark mode and save preference in localStorage
toggleButton.addEventListener('click', () => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        disableDarkMode(); // Switch to light mode
        localStorage.setItem('darkMode', 'false'); // Save light mode state
    } else {
        enableDarkMode(); // Switch to dark mode
        localStorage.setItem('darkMode', 'true'); // Save dark mode state
    }
});


async function fetchMemberData(memberFile) {
    return getmember_data(memberFile);
}

async function fetchMembers() {
    const membersDiv = document.getElementById('members');

    for (const memberFile of members) {
        try {
            const member = await fetchMemberData(memberFile);
            const memberCard = document.createElement('div');
            memberCard.className = 'card';


            memberCard.innerHTML = `
                <h3>${member.name}</h3>
                <p><strong>Branch:</strong> ${member.branch}</p>
                <p><strong>GitHub ID:</strong> <a href="${member.url}" target="_blank" class="username" data-name="${member.name}">${member.githubID}</a></p>
            `;

            // Adding hover effect to fetch joke
            memberCard.addEventListener('mouseenter', () => {
                const loadingElement = document.createElement('p');
                loadingElement.id = 'loading';
                loadingElement.innerText = 'Loading...';
                memberCard.appendChild(loadingElement);
                let hoverTimer = setTimeout(async () => {
                    const joke = await fetchJoke(member.name);
                    showJoke(memberCard, joke);
                    memberCard.removeChild(loadingElement);
                }, 2000); // 2 seconds

                // Clear the timer if the mouse leaves the card before 5 seconds
                memberCard.addEventListener('mouseleave', () => {
                    clearTimeout(hoverTimer);
                    hideJoke(memberCard);
                    const loadingElement = memberCard.querySelector('#loading');
                    if (loadingElement) {
                        memberCard.removeChild(loadingElement);
                    }
                }, { once: true });
            });

            membersDiv.appendChild(memberCard);
        } catch (error) {
            console.error(`Error fetching ${memberFile}:`, error);
        }
    }
    applyDarkModePreference();
}

async function fetchJoke(name) {
    try {
        const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyD27gU3W72I5WmBi3UAGQHwd9ZJy_0d4J8`, {
            contents: [
                {
                    parts: [
                        {
                            text: `Hi Gemini, please make a tech joke for ${name} as most of the names are from India and are students of AKGEC Ghaziabad so make jokes related to Indian-centric tech memes and areas so that he can laugh a little. Make sure the joke remains professional and yet funny use some tech terms and the name of their college along with the name of the person in the joke to make it more personal and also make fun of frontend developers, backend developers, Flutter Developers and ML developers. Do not make fun of all Frontend, Backend, Flutter and ML developers in one joke choose randomly from them and then give a response also do not create scenarios and multiple jokes and the joke should be a of maximum 100 words. Make sure the probability of joke on each developer is equal.`


                        }
                    ]
                }
            ]
        });

        return response.data.candidates[0].content.parts[0].text; // Extracting the joke from the response
    } catch (error) {
        console.error("Error fetching joke from Gemini API:", error.response ? error.response.data : error.message);
        return "Oops! Something went wrong while fetching a joke.";
    }
}

function showJoke(memberCard, joke) {
    const jokeElement = document.createElement('p');
    jokeElement.className = 'joke';
    jokeElement.innerText = joke;
    jokeElement.style.animation = 'fadeIn 0.5s'; // Minimal animation
    memberCard.appendChild(jokeElement);
}

function hideJoke(memberCard) {
    const jokeElement = memberCard.querySelector('.joke');
    if (jokeElement) {
        memberCard.removeChild(jokeElement);
    }
}

// Call to fetch members
fetchMembers();

// Call the function to apply the saved preference on page load
applyDarkModePreference();


const addmember_btn = document.getElementById('add_member');
addmember_btn.addEventListener('click', async () => {
    const member_name = prompt("Enter the name of the member");
    const member_branch = prompt("Enter the branch of the member");
    const member_githubID = prompt("Enter the GitHub ID of the member");
    const member_url = prompt("Enter the GitHub URL of the member");

    const member = {
        name: member_name,
        branch: member_branch,
        githubID: member_githubID,
        url: member_url
    };
    console.log(member);
    if(member.name === "" || member.branch === "" || member.githubID === "" || member.url === ""){
        return;
    }
    add_member_to_fb(member);
    location.reload();
});