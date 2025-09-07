import AuthForm from "../components/AuthForm";

function Register() {
    return (
        <AuthForm 
            method="register"
            route="/auth/register"
        />
    );
}

export default Register;