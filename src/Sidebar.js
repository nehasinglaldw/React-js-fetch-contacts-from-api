import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Form, Button, Col } from "react-bootstrap";
import { AiFillCheckCircle } from "react-icons/ai";
import { AiOutlineAlignRight } from "react-icons/ai";
import { DEFAULT_URL } from "./Constant/config";
const Sidebar = ({ contactFunc }) => {
  const BEARER_TOKEN = localStorage.getItem("token");
  const [minSNumber, setMinSNumber] = useState(null);
  const [maxSNumber, setMaxSNumber] = useState(null);
  const [minRNumber, setMinRNumber] = useState(null);
  const [maxRNumber, setMaxRNumber] = useState(null);
  const [dataTags, setDataTags] = useState(null);
  const [tagsArr, setTagsArr] = useState([]);
  const [tagsExcludeArr, setTagsExcludeArr] = useState([]);
  let getOptions = { headers: { Authorization: `Bearer ${BEARER_TOKEN}` } };
  useEffect(() => {
    getTags();
  }, []);

  const saveFilter = async () => {
    const tagsArray = tagsArr.concat(tagsExcludeArr);
    let messageSentParams = "";
    let messageReceiveParams = "";
    const tagsParams = tagsArray.length !== 0 ? `?tags=[${tagsArray}]` : ``;

    if (minSNumber || maxSNumber) {
      if (minSNumber) {
        messageSentParams = `&minMessagesSent=${minSNumber}`;
      }
      if (maxSNumber) {
        messageSentParams = `&maxMessagesSent=${maxSNumber}`;
      }
      if (minSNumber && maxSNumber) {
        messageSentParams = `&minMessagesSent=${minSNumber}&maxMessagesSent=${maxSNumber}`;
      }
    }

    if (minRNumber || maxRNumber) {
      if (minRNumber) {
        messageReceiveParams = `&minMessagesRecv=${minRNumber}`;
      }
      if (maxRNumber) {
        messageReceiveParams = `&maxMessagesRecv=${maxRNumber}`;
      }
      if (minRNumber && maxRNumber) {
        messageReceiveParams = `&minMessagesRecv=${minRNumber}&maxMessagesRecv=${maxRNumber}`;
      }
    }

    try {
      const response = await axios.get(
        `${DEFAULT_URL}/contacts${tagsParams}${messageSentParams}${messageReceiveParams}`,
        getOptions
      );
      contactFunc(response.data, "sidebar");
    } catch (error) {
      console.error(error);
    }
  };

  const includeTags = (element) => {
    const index = tagsArr.indexOf(element);
    if (index === -1) {
      setTagsArr((tagsArr) => [...tagsArr, element]);
    } else {
      setTagsArr(tagsArr.filter((value) => value !== element));
    }
  };

  const excludeTags = (element) => {
    const index = tagsExcludeArr.indexOf(element);
    if (index === -1) {
      setTagsExcludeArr((tagsExcludeArr) => [...tagsExcludeArr, element]);
    } else {
      setTagsExcludeArr(tagsExcludeArr.filter((value) => value !== element));
    }
  };

  const getTags = async () => {
    try {
      const response = await axios.get(`${DEFAULT_URL}/tags`, getOptions);
      setDataTags(response.data.tags);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h3>
        <AiOutlineAlignRight style={{ marginBottom: "4px" }} />
        <span className="side-heading"> Audience</span>
      </h3>
      <Form.Group className="mb-3 mt-3">
        <Form.Label>Include Tags:</Form.Label>
        {dataTags &&
          dataTags.map((value, index) => {
            return (
              <Row
                className={
                  tagsExcludeArr.includes(value.name)
                    ? "tags-row row-disabled"
                    : "tags-row"
                }
                key={index}
                onClick={() => includeTags(value.name)}
              >
                <Col lg="10" md="10" xs="10">
                  <span>{value.name}</span>
                </Col>
                <Col lg="2" md="2" xs="2" className="check-icon">
                  <AiFillCheckCircle
                    style={
                      tagsArr.includes(value.name)
                        ? { color: "green" }
                        : { color: "gray" }
                    }
                  />
                </Col>
              </Row>
            );
          })}
      </Form.Group>

      <Form.Group className="mb-3 mt-3">
        <Form.Label>Exclude Tags:</Form.Label>
        {dataTags &&
          dataTags.map((value, index) => {
            return (
              <>
                <Row
                  className={
                    tagsArr.includes(value.name)
                      ? "tags-row row-disabled"
                      : "tags-row"
                  }
                  key={index}
                  onClick={() => excludeTags(value.name)}
                >
                  <Col lg="10" md="10" xs="10">
                    <span>{value.name}</span>
                  </Col>
                  <Col lg="2" md="2" xs="2" className="check-icon">
                    <AiFillCheckCircle
                      style={
                        tagsExcludeArr.includes(value.name)
                          ? { color: "green" }
                          : { color: "gray" }
                      }
                    />
                  </Col>
                </Row>
              </>
            );
          })}
      </Form.Group>

      <Form.Group className="mb-3 ">
        <Row>
          <Form.Label>Message Sent:</Form.Label>
          <Col>
            <Form.Control
              type="number"
              value={minSNumber}
              onChange={(e) => {
                setMinSNumber(e.target.value);
              }}
              className="bg-light"
              placeholder="Min"
            />
          </Col>
          <Col>
            <Form.Control
              type="number"
              value={maxSNumber}
              onChange={(e) => {
                setMaxSNumber(e.target.value);
              }}
              className="bg-light"
              placeholder="Max"
            />
          </Col>
        </Row>
      </Form.Group>

      <Form.Group className="mb-3 ">
        <Row>
          <Form.Label>Message Received:</Form.Label>
          <Col>
            <Form.Control
              type="number"
              value={minRNumber}
              onChange={(e) => {
                setMinRNumber(e.target.value);
              }}
              className="bg-light"
              placeholder="Min"
            />
          </Col>
          <Col>
            <Form.Control
              type="number"
              value={maxRNumber}
              onChange={(e) => {
                setMaxRNumber(e.target.value);
              }}
              className="bg-light"
              placeholder="Max"
            />
          </Col>
        </Row>
      </Form.Group>
      <div className="d-grid ">
        <Button variant="success" onClick={saveFilter}>
          Save Filters
        </Button>
      </div>
    </>
  );
};

export default Sidebar;
