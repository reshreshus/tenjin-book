export const appMenuItems = (backup) => {
  return [
    // {
    //     "desc": "Export All",
    //     "shortcut": "",
    //     "hotkeyJs": "",
    //     "func": () => {
    //         console.log("Export All");
    //     }
    // },
    {
      "desc": "Backup",
      "shortcut": "",
      "hotkeyJs": "",
      "func": () => {
        console.log("Backup");
        backup();
      }
    }
  ]
}