import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import { DEFAULT_URL } from "./Constant/config";
import Sidebar from "./Sidebar";
import Main from "../src/Main";

const App = () => {
  const [data, setData] = useState([]);
  const BEARER_TOKEN = localStorage.getItem("token");
  const [page, setPage] = useState(null);
  const [length, setLength] = useState(null);
  useEffect(() => {
    axios
      .post("https://api-teams.chatdaddy.tech/token", {
        refreshToken: "059c420e-7424-431f-b23b-af0ecabfe7b8",
        teamId: "a001994b-918b-4939-8518-3377732e4e88",
      })
      .then(function (response) {
        localStorage.setItem("token", response.data.access_token);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    getContacts();
  }, []);

  const getContacts = async () => {
    let getOptions = { headers: { Authorization: `Bearer ${BEARER_TOKEN}` } };
    const pagetype = page ? `?page=${page}` : null;
    try {
      const response = await axios.get(
        pagetype
          ? `${DEFAULT_URL}/contacts${pagetype}`
          : `${DEFAULT_URL}/contacts`,
        getOptions
      );
      contactFunc(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const contactFunc = (value, checkpoint) => {
    setLength(value.contacts.length);
    if (checkpoint === "sidebar") {
      setData(value.contacts);
      setPage(value.nextPage);
    } else {
      setData(data.concat(value.contacts));
      setPage(value.nextPage);
    }
  };
  return (
    <Container fluid id="wrapper">
      <Row>
        <Col
          lg="3"
          md="3"
          xs="12"
          className="border-end bg-white"
          id="sidebar-wrapper"
        >
          <div className="sidebar-heading">
            <Sidebar contactFunc={contactFunc} />
          </div>
          <div className="list-group list-group-flush"></div>
        </Col>
        <Col lg="9" md="9" xs="12">
          <Main getContacts={getContacts} data={data} length={length} />
        </Col>
      </Row>
    </Container>
  );
};

export default App;
