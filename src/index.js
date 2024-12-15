document.addEventListener('DOMContentLoaded', () => {
    const dogBar = document.getElementById('dog-bar');
    const dogInfo = document.getElementById('dog-info');
    const filterButton = document.getElementById('good-dog-filter');
    let filterGoodDogs = false;
  
    // Fetch all pups and display in the dog bar
    fetchPups();
  
    async function fetchPups() {
      try {
        const response = await fetch('http://localhost:3000/pups');
        const pups = await response.json();
        renderDogBar(pups);
      } catch (error) {
        console.error('Error fetching pups:', error);
      }
    }
  
    // Render each pup in the dog bar
    function renderDogBar(pups) {
      dogBar.innerHTML = '';  
      pups.forEach(pup => {
        if (filterGoodDogs && !pup.isGoodDog) {
          return; 
        }
        const span = document.createElement('span');
        span.textContent = pup.name;
        span.addEventListener('click', () => showDogInfo(pup));  
        dogBar.appendChild(span);
      });
    }
  
    // Show the pup's info when clicked
    function showDogInfo(pup) {
      dogInfo.innerHTML = ''; 
  
      const img = document.createElement('img');
      img.src = pup.image; // Set image URL
      const h2 = document.createElement('h2');
      h2.textContent = pup.name;
  
      const button = document.createElement('button');
      button.textContent = pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!';
      button.addEventListener('click', () => toggleGoodDog(pup, button));
  
      dogInfo.appendChild(img);
      dogInfo.appendChild(h2);
      dogInfo.appendChild(button);
    }
  
    // Toggle the Good/Bad Dog status and update the pup's information
    async function toggleGoodDog(pup, button) {
      const updatedPup = {
        isGoodDog: !pup.isGoodDog
      };
  
      try {
        await fetch(`http://localhost:3000/pups/${pup.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedPup)
        });
  
        // Update the button text after toggling
        pup.isGoodDog = !pup.isGoodDog;
        button.textContent = pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!';
      } catch (error) {
        console.error('Error updating pup:', error);
      }
    }
  
    // Toggle the filter button to show only good dogs
    filterButton.addEventListener('click', () => {
      filterGoodDogs = !filterGoodDogs;
      filterButton.textContent = filterGoodDogs ? 'Filter good dogs: ON' : 'Filter good dogs: OFF';
      fetchPups();  
    });
  });
  