import { IdxSetUpProfile } from "@src/components/auth/setUpProfileIndex";

const PageSetupProfile = () => {
    IdxSetUpProfile.Hooks.useRedirect()
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg ">
        <IdxSetUpProfile.Text.Title />
        <IdxSetUpProfile.Text.Message />
        <IdxSetUpProfile.Actions.ConfirmSetup />
      </div>
    </div>
  );
};

export default PageSetupProfile;
