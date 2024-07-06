import React from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Fab from "@mui/material/Fab";
// import SendIcon from "@material-ui/icons/Send";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import config from "../../config.json";
import AppContext from "../../context/AppContext";
import usePubSub from "../../utils/PubSub";
import Dora from "../../assets/dora.png";
import moment from "moment";

import { fetchMembers, sendMessage, fetchMessages } from "../../services/group";

import io from "socket.io-client";

import SendIcon from "@mui/icons-material/Send";

const Chat = () => {
  const socketRef = React.useRef(null);
  const { publish } = usePubSub();

  const loadedFirstTime = React.useRef(null);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(20);
  const { user_details } = React.useContext(AppContext);
  const [messages, setMessages] = React.useState([]);
  const [members, setMembers] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [messagesContext, setMessagesContext] = React.useState([]);
  const sendingMessage = React.useRef(null);

  React.useEffect(() => {
    console.log("here?");
    if (socketRef.current) return;
    if (!user_details) return;
    const { user_id, group_id } = user_details;
    console.log("user_id, group_id", user_id, group_id);

    if (!user_id || !group_id) return;

    const socket = io(config.SOCKET_URL, {
      query: `user_id=${user_id}&group_id=${group_id}`,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("socket connected");
    });

    socket.on("new_message", (data) => {
      console.log("new_message", data);
      publish("new_message", data);
      //   setMessages([...messages, data]);
    });

    socket.on("new_member", (data) => {
        console.log("new_member", data);
        publish("new_member", data);
        //   setMessages([...messages, data]);
      });

    socketRef.current = socket;
  }, []);

  const fetchInitialData = async () => {
    if (!user_details) {
      loadedFirstTime.current = false;
      return;
    }
    const { user_id, group_id } = user_details;
    console.log("user_id, group_id", user_id, group_id);

    if (!user_id || !group_id) {
      loadedFirstTime.current = false;
      return;
    }
    const members = await fetchMembers({ user_id, group_id });
    if (members?.data?.members?.length) setMembers(members.data.members);

    // reverse this
    const messages = await fetchMessages({ user_id, group_id, page, limit });
    if (messages?.data?.messages?.length) {
      const _data = messages.data.messages.reverse();
      setMessages(_data);
    }
  };
  console.log("messages", messages);

  React.useEffect(() => {
    console.log("here?", user_details);
    if (loadedFirstTime.current) return;
    loadedFirstTime.current = true;
    fetchInitialData();
  }, []);

  const handleSubmit = async () => {
    try {
      if (sendingMessage.current) return;
      sendingMessage.current = true;
      const findUser = members.find(
        (item) => item.user_id === user_details.user_id
      );
      const body = {
        user_id: user_details.user_id,
        group_id: user_details.group_id,
        message,
        messagesContext: [
          {
            role: "user",
            content: `UserName: ${
              findUser ? findUser.userName : ""
            }, Message: ${message || ""}`,
          },
          ...messagesContext,
        ],
      };
      setMessage("");
      await sendMessage(body);
    } catch (error) {
      console.log(error);
    } finally {
      sendingMessage.current = false;
    }
  };

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    const element = document.getElementById("chat_list_container");
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  };

  // Scroll to bottom whenever chatMessages changes
  React.useEffect(() => {
    scrollToBottom();
    const _data = messages
      .slice(-5)
      .map((item) => {
        return {
          role: item?.user_id?.userName ? "user" : "assistant",
          content: `UserName: ${
            item?.user_id?.userName || "Dora"
          }, Message: ${item?.message || ""}`,
        };
      })
      .reverse();
    setMessagesContext(_data);
  }, [messages]);

  const getInitials = (name) => {
    const nameParts = name.split(" ");
    const initials = nameParts.map((part) => part.charAt(0)).join("");
    return initials.toUpperCase();
  };

  usePubSub(
    "new_message",
    React.useCallback((data) => {
      setMessages((prev) => (prev?.length ? [...prev, data] : [data]));
    }, [])
  );

  usePubSub(
    "new_member",
    React.useCallback((data) => {
      setMembers((prev) => (prev?.length ? [...prev, data] : [data]));
    }, [])
  );

  return (
    <div>
      {/* <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5" className="header-message">
            Chat
          </Typography>
        </Grid>
      </Grid> */}
      <Grid
        container
        component={Paper}
        style={{ width: "100%", height: "100vh", boxShadow: "none" }}
      >
        <Grid item xs={3} style={{ borderRight: "1px solid #e0e0e0" }}>
          <List>
            <ListItem button key="RemySharp">
              <ListItemIcon>
                <Avatar alt="Remy Sharp" src={Dora} />
              </ListItemIcon>
              <ListItemText
                primary={user_details?.group_details?.name || "No Name"}
              ></ListItemText>
            </ListItem>
          </List>
          <Divider />
          <Typography variant="h6" className="header-message">
            Members
          </Typography>
          <Divider />
          <List>
            {members.map((item) => {
              return (
                <ListItem
                  button
                  key={user_details.user_id}
                  style={
                    user_details.user_id === item.user_id
                      ? { backgroundColor: "#D3D3D3" }
                      : {}
                  }
                >
                  {/* <ListItemIcon> */}
                  <Avatar>
                    {item.userName ? getInitials(item.userName) : "NN"}
                  </Avatar>
                  {/* </ListItemIcon> */}
                  <ListItemText
                    primary={item?.userName || "No Name"}
                  ></ListItemText>
                  {/* <ListItemText secondary="online" align="right"></ListItemText> */}
                </ListItem>
              );
            })}
          </List>
        </Grid>
        <Grid item xs={9}>
          <List
            id="chat_list_container"
            style={{ height: "80vh", overflowY: "auto" }}
          >
            {messages.map((item, idx) => {
              return (
                <ListItem key={idx}>
                  <Grid container>
                    <Grid item xs={12}>
                      {item?.user_id?._id !== user_details.user_id ||
                      item.sender === "system" ? (
                        <ReactMarkdown
                          children={item.message}
                          remarkPlugins={[remarkGfm]}
                        />
                      ) : (
                        <ListItemText
                          align={
                            item.sender === "system" ||
                            item?.user_id?._id !== user_details.user_id
                              ? "left"
                              : "right"
                          }
                          primary={item.message}
                        ></ListItemText>
                      )}
                      {/* <ListItemText
                        align={
                          item.sender === "system" ||
                          item.user_id._id !== user_details.user_id
                            ? "left"
                            : "right"
                        }
                        primary="Hey man, What's up ?"
                      ></ListItemText>
                      <ReactMarkdown
                        children={item.message}
                        remarkPlugins={[remarkGfm]}
                      /> */}
                    </Grid>
                    <Grid item xs={12}>
                      <ListItemText
                        align={
                          item.sender === "system" ||
                          item?.user_id?._id !== user_details.user_id
                            ? "left"
                            : "right"
                        }
                        secondary={item?.user_id?.userName || "Dora"}
                      ></ListItemText>
                      <ListItemText
                        align={
                          item.sender === "system" ||
                          item?.user_id?._id !== user_details.user_id
                            ? "left"
                            : "right"
                        }
                      >
                        <Typography style={{ fontSize: "12px", color: "#888" }}>
                          {moment(item.timestamp).format("Do MMM, h:mm a")}
                        </Typography>
                      </ListItemText>
                    </Grid>
                  </Grid>
                </ListItem>
              );
            })}
          </List>
          <Divider />
          <Grid container style={{ padding: "20px" }}>
            <Grid item xs={11}>
              <TextField
                id="outlined-basic-email"
                label="Type Something"
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Grid>
            <Grid xs={1} align="right">
              <Fab color="primary" aria-label="add" onClick={handleSubmit}>
                <SendIcon />
              </Fab>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Chat;
