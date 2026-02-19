import { ComponentsSignIn } from "@src/components/auth/signInIndex";

const SignUpPage = () => {

  return (
    <ComponentsSignIn.Fields.Provider>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg ">
          <ComponentsSignIn.Text.Title />
          <ComponentsSignIn.Fields.Fields />
        </div>
        <div className="h-4" />
        <div className="w-full max-w-lg">
          <ComponentsSignIn.Actions.SubmitForm />
        </div>
        <div className="h-4" />
        <div className="w-full max-w-lg flex justify-between">
            <ComponentsSignIn.Actions.RedirectLogIn />
        </div>
        <div className="h-4" />
        <div className="w-full max-w-lg">
            <ComponentsSignIn.Text.Disclaimer />
        </div>
      </div>
    </ComponentsSignIn.Fields.Provider>
  );
};

export default SignUpPage;