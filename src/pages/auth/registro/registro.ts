import type { IUser } from '../../../types/IUser';


const registerForm = document.getElementById("form_register") as HTMLFormElement;

registerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;

    const newUser: IUser = {
        email: email.value,
        loggedIn: false,
        password: password.value,
        role: 'client'
    };

    const storedUsers = localStorage.getItem('users');

    const users: IUser[] = storedUsers ? JSON.parse(storedUsers) : [];

    // Esta funcion sirve para verificar si un mail ya existe
    const userExists = users.some(user => user.email === newUser.email);
    if (userExists) {
        alert("Este email ya está registrado.");
        return;
    }

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert("Registro completado");
    registerForm.reset();

});