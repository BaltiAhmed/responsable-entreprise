import React, { useState, useEffect, useRef, useContext } from "react";
import "./style.css";
import { Input, Button } from "@material-ui/core";

import { Container, Row, Col, Form, Image, ListGroup } from "react-bootstrap";
import { Authcontext } from "../../../context/auth-context";
import { useParams } from "react-router-dom";

const Chat = (props) => {
  const scroll = useRef();
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState(null);
  const [error, seterror] = useState(null);
  const [success, setsuccess] = useState(null);

  const [list, setList] = useState([]);

  const id = useParams().id;

  const auth = useContext(Authcontext);
  useEffect(() => {
    setInterval(() => {
      const sendRequest = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/message/client/${id}`
          );

          const responseData = await response.json();
          if (!response.ok) {
            throw new Error(responseData.message);
          }

          setMessages(responseData.messages);
        } catch (err) {
          seterror(err.message);
        }
      };
      console.log(messages);

      sendRequest();
    }, 1000);
  }, []);

  async function sendMessage(e) {
    e.preventDefault();
    setMsg(null);
    if (msg) {
      const p = {
        text: msg,
        idSender: "60a8e3b6cf2fac17009360e8",
        idRecever: id,
        IdAgriculteur: id,
      };
      setMessages(messages.concat(p));
      console.log(messages);
      try {
        let response = await fetch(
          "http://localhost:5000/api/message/ajoutClient",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: msg,
              idSender: "60a8e3b6cf2fac17009360e8",
              idRecever: id,
              IdAgriculteur: id,
            }),
          }
        );
        let responsedata = await response.json();
        if (!response.ok) {
          throw new Error(responsedata.message);
        }
      } catch (err) {
        console.log(err);
        seterror(err.message || "probleme!!");
      }
    }

    //scroll.current.scrollIntoView({ behavior: "smooth" });
  }
  console.log(id);
  return (
    <Container>
      <Row>
        <Col></Col>
        <Col xs={9}>
          <div>
            <div className="msgs">
              {messages.map((item) => (
                <div>
                  {item.idSender === "60a8e3b6cf2fac17009360e8"
                    ? item.idRecever === id && (
                        <div
                          key={id}
                          className={`msg ${
                            item.idSender === "60a8e3b6cf2fac17009360e8"
                              ? "sent"
                              : "received"
                          }`}
                        >
                          <p>{item.text}</p>
                        </div>
                      )
                    : item.idSender === id && (
                        <div
                          key={id}
                          className={`msg ${
                            item.idSender === "60a8e3b6cf2fac17009360e8"
                              ? "sent"
                              : "received"
                          }`}
                        >
                          <p>{item.text}</p>
                        </div>
                      )}
                </div>
              ))}
            </div>
            <div>
              <form onSubmit={sendMessage}>
                <div className="sendMsg">
                  <Input
                    style={{
                      width: "78%",
                      fontSize: "15px",
                      fontWeight: "550",
                      marginLeft: "5px",
                      marginBottom: "-3px",
                    }}
                    placeholder="Message..."
                    type="text"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                  />
                  <Button
                    style={{
                      width: "18%",
                      fontSize: "15px",
                      fontWeight: "550",
                      margin: "4px 5% -13px 5%",
                      maxWidth: "200px",
                    }}
                    type="submit"
                  >
                    Envoyer
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
};

export default Chat;
