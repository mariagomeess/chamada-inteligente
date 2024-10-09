document.getElementById('presenca-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  const photoInput = document.getElementById('photo');
  const photo = await convertImageToBase64(photoInput.files[0]);

  navigator.geolocation.getCurrentPosition(async (position) => {
      const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
      };

      try {
          const response = await fetch('http://127.0.0.1:3000/api/presencas', { // Certifique-se de que a rota da API está correta
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ name, description, location, photo })
          });

          if (response.ok) {
              document.getElementById('presenca-form').reset();
              fetchPresencas();
          } else {
              console.error('Erro ao adicionar presença:', response.statusText);
          }
      } catch (error) {
          console.error('Erro ao conectar com a API:', error);
      }
  });
});

async function convertImageToBase64(file) {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
  });
}

async function fetchPresencas() {
  try {
      const response = await fetch('http://127.0.0.1:3000/api/presencas'); // Certifique-se de que a rota da API está correta
      if (!response.ok) {
          throw new Error('Erro ao buscar presenças');
      }
      const presencas = await response.json();
      const list = document.getElementById('presencas-list');
      list.innerHTML = '';
      presencas.forEach(p => {
          const item = document.createElement('div');
          item.innerHTML = `
              <h3>${p.name}</h3>
              <p>${p.description}</p>
              <img src="${p.photo}" alt="${p.name}" style="max-width: 100%; height: auto;">
          `;
          list.appendChild(item);
      });
  } catch (error) {
      console.error('Erro ao carregar presencas:', error);
  }
}

fetchPresencas();