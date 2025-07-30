export const sendMessageToApp = (message: any) => {
  // Send to React Native WebView
if (window && (window as any).ReactNativeWebView) {
    console.log("Sending message to React Native WebView:", message);
    (window as any).ReactNativeWebView.postMessage(
        JSON.stringify(message)
    );
  } else {
    console.log("Sending message to parent window:", message);
    window.parent.postMessage(message, "*");
  }
};
