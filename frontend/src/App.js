import React, { useMemo, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import AppContext from "./context/AppContext";
import Join from "./components/Join";
import Group from "./components/Group";

function App() {
  const [user_details, set_user_details] = useState(null);

  const contextValue = useMemo(
    () => ({
      user_details,
      set_user_details,
    }),
    [user_details]
  );
  console.log(user_details);
  return (
    <AppContext.Provider value={contextValue}>
      <div className="App">
        {/* <Join /> */}
        {!user_details || !user_details.user_id || !user_details.group_id ? (
          <Join />
        ) : (
          <Group />
        )}
      </div>
    </AppContext.Provider>
  );
}

export default App;

// export default function Home({ params }) {
//   const [user_id, set_user_id] = useState(null)
//   const [group_id, set_group_id] = useState(null)

//   const contextValue = useMemo(
//     () => ({
//       set_user_id,
//       set_group_id,
//     }),
//     [auth, metaData]
//   );

//   return (
//     <AppContext.Provider value={contextValue}>
//       <Head>
//         {/* Change text here maybe */}
//         <title>Secure Message</title>
//         <link rel="icon" href="/favicon.ico" />
//         <meta
//           name="viewport"
//           content="width=device-width, initial-scale=1, user-scalable=0"
//         />
//       </Head>
//       <link rel="icon" href="/favicon.ico" />
//       <Main />
//     </AppContext.Provider>
//   );
// }
