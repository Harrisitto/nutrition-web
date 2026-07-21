import { ComponentsSignIn } from "@src/components/auth/signInIndex";
import { useState } from "react";

const SignUpPage = () => {
  const [isNutritionist, setIsNutritionist] = useState(false);

  if (!isNutritionist) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg ">
          <ComponentsSignIn.Text.Title />
          <ComponentsSignIn.Actions.VerifyNutritionistAccount
            confirmNutritionist={() => setIsNutritionist(true)}
          />
        </div>
        <div className="h-4" />
      </div>
    );
  }

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
        <div className="w-full max-w-lg">
          <ComponentsSignIn.Text.Disclaimer />
        </div>
      </div>
    </ComponentsSignIn.Fields.Provider>
  );
};

export default SignUpPage;
