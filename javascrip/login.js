const form = document.getElementById('form-login');


form.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const data = new FormData(form); 
    console.log(data);

    
    const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            email: data.get('email'), 
            password: data.get('password') 
        })
    });

    if (response.ok) {
        const result = await response.json(); 
        window.localStorage.setItem('token', result.token);
        console.log(window.localStorage)
        window.location = "index.html";
    } else {
        document.querySelector(".logged_error").style.visibility = "visible";
        const errorMessage = await response.text(); 
        errorMessage.innerHTML = `Erreur de connexion : ${errorMessage}`;
    }
});