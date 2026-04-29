import type { IUser } from "../../../types/IUser";
import { navigate } from "../../../utils/navigate";

const form = document.getElementById("form") as HTMLFormElement;
const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;

const usersString = localStorage.getItem("users");
const users: IUser[] = usersString ? JSON.parse(usersString) : [];

form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();

  const valueEmail = inputEmail.value;
  const valuePassword = inputPassword.value;

  const userFound = users.find(
    (u) => u.email === valueEmail && u.password === valuePassword
  );

  if(!userFound){
    alert("Usuario no encontrado")
    return;
  }

  const valueRol = userFound.role;

  const user: IUser = {
    email: valueEmail,
    loggedIn: true,
    password: valuePassword,
    role: valueRol
  };

  const parseUser = JSON.stringify(user);
  localStorage.setItem("userData", parseUser);

  if (valueRol === "admin") {
    navigate("/src/pages/admin/home/home.html");
  } else if (valueRol === "client") {
    navigate("/src/pages/client/home/home.html");
  }
});
