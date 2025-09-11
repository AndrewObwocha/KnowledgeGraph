import AuthForm from "../components/AuthForm";

function Register() {
    return (
        <AuthForm 
            method="register"
            route="/api/auth/register"
        />
    );
}

export default Register;