const Api: string = import.meta.env.VITE_BACKEND_URL + "/api";
const AssetsUrl: string = import.meta.env.VITE_BACKEND_URL + `/assets/images/`;
const UpdateModalId = "update-modal";
const CreateModalId = "create-modal";

const constants = { Api, AssetsUrl, CreateModalId, UpdateModalId };

export default constants;
