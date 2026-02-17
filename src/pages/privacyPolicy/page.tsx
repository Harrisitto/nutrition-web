import CompPrivacyPolicy from "../../components/privacy";

export const PagePrivacyPolicy = () => {
  return (
    <>
      <CompPrivacyPolicy.Text.Title />
      <CompPrivacyPolicy.Text.Description />
      <div className="p-10">
      <CompPrivacyPolicy.Documentation.LangDefault />
      </div>
    </>
  );
};
