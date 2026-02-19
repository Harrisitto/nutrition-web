import { ComponentsAuthManagement } from "@src/components/auth/managementIndex";

const PageAppDashboard = () => {

    console.log("Rendering Dashboard");

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to your dashboard! Here you can manage your account, view your activity, and access exclusive features.</p>
            <ComponentsAuthManagement.Buttons.SignOut />
        </div>
    );

}

export default PageAppDashboard;