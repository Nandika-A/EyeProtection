// Function to execute the 20-20-20 rule
function executeTwentyTwentyTwentyRule() {
    // Get all the elements on the page
    const elements = document.getElementsByTagName('*');

    // Iterate through each element
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];

        // Apply the rule to text elements
        if (element instanceof Text) {
            const text = element.textContent;

            // Split the text into words
            const words = text.split(' ');

            // Iterate through each word
            for (let j = 0; j < words.length; j++) {
                const word = words[j];

                // Apply the rule to words longer than 3 characters
                if (word.length > 3) {
                    // Replace the word with the modified word
                    words[j] = word.substring(0, 3) + '-' + word.substring(3);
                }
            }

            // Join the modified words back into a single string
            const modifiedText = words.join(' ');

            // Replace the original text with the modified text
            element.textContent = modifiedText;
        }
    }
}

// Execute the 20-20-20 rule when the page finishes loading
window.addEventListener('load', executeTwentyTwentyTwentyRule);
