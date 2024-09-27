const members = [
    'AbhinavD.json', 'Ankita.json', 'Astha.json', 'Lakshay.json', 'Pranav.json',
    'Shashwat.json', 'Sneha.json', 'VidushiD.json', 'Aditya.json', 'AnshikaD.json',
    'Atul.json', 'Mahak.json', 'Ritik.json', 'Shivang.json', 'Sugandhi.json',
    'Vinay.json', 'AkshatD.json', 'Arjun.json', 'Ayush.json', 'Naitik.json',
    'Ritika.json', 'ShivaniD.json', 'Tanisha.json', 'Yash.json', 'Amulya.json',
    'Arnav.json', 'Dikshant.json', 'Navneet.json', 'Sanvi.json', 'Shivansh.json',
    'Tanishka.json', 'Yashvi.json', 'Anchal.json', 'Arpit.json', 'FaizalD.json',
    'Navya.json', 'Saumyal.json', 'Shreyaa.json', 'Tushar.json',
    'Anish.json', 'Aryan.json', 'Khushi.json', 'Neha.json', 'Shailja.json',
    'Siddhartha.json', 'VanshD.json', 'yuga.json', 'Rohit.json'
];


async function fetchMemberData(memberFile) {
    const response = await axios.get(`members/${memberFile}`);
    return response.data;
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
                let hoverTimer = setTimeout(async () => {
                    const joke = await fetchJoke(member.name);
                    showJoke(memberCard, joke);
                }, 5000); // 5 seconds

                // Clear the timer if the mouse leaves the card before 5 seconds
                memberCard.addEventListener('mouseleave', () => {
                    clearTimeout(hoverTimer);
                    hideJoke(memberCard);
                }, { once: true });
            });

            membersDiv.appendChild(memberCard);
        } catch (error) {
            console.error(`Error fetching ${memberFile}:`, error);
        }
    }
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
