import NavbarComponent from "../components/NavbarComponent";
import AuthFormComponent from "../components/AuthFormComponent";

function Register() {
  return (
    <>
      <NavbarComponent />
      <AuthFormComponent method="register" route="/api/auth/register" />
    </>
  );
}

export default Register;
