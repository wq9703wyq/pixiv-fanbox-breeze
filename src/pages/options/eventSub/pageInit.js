import useFileView from "../store/useFileView";

export default () => {
  const _useFileView = useFileView();

  return {
    options_draftList_init: (args) => {
      _useFileView.replaceDraftList(args);
    },
  };
};
