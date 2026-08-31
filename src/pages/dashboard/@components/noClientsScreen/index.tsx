import { ConfirmSetup } from "./actions";
import { Fields, Provider } from "./provider";
import { Message, Title } from "./text";

const NoClientsPage = () => {
  return (
    <Provider>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg ">
          <Title />
          <Message />
          <Fields />
          <ConfirmSetup />
        </div>
      </div>
    </Provider>
  );
};

export default NoClientsPage;
