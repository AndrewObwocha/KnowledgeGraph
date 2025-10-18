import NavbarComponent from "../components/NavbarComponent";
import AuthFormComponent from "../components/AuthFormComponent";

function LoginPage() {
  return (
    <>
      <NavbarComponent />
      <AuthFormComponent method="login" route="/api/auth/login" />
    </>
  );
}

export default LoginPage;
