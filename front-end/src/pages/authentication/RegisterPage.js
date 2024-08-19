import Layout from '../../components/Layout.js';
import RegisterComponent from '../../components/authentication/RegisterComponent.js.js';


function Register() {


    return (
        <Layout
            headerText="Create your profile"
            Content=<RegisterComponent />

        />

    );
}
export default Register;