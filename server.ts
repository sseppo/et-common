var localhost = false;

export const serverData = () => {
  //var serverUrl = "http://localhost:5000";
  var serverUrl = "https://et-server-877cd73b3971.herokuapp.com";
  if (localhost) {
    serverUrl = "http://localhost:5000";
  }

  const serverData = {
    serverUrl: serverUrl,
  };
  return serverData;
};
