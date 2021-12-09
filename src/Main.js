/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
// import axios from "axios";
import { Row, Form, Spinner } from "react-bootstrap";
import { AiFillCheckCircle } from "react-icons/ai";
import InfiniteScroll from "react-infinite-scroll-component";
// import { DEFAULT_URL } from "./Constant/config";
import ImageUrl from "./Images/20211203052653.jpeg";

let tempArr = [];
const Main = ({ data, getContacts, length }) => {
  // const BEARER_TOKEN = localStorage.getItem("token");
  const [name, setName] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);

  const nextPage = () => {
    setSelectAll(false);
    if (data.length > 0) {
      getContacts();
    }
  };

  const filterData = data
    ? data.filter((value) => value.name.includes(name))
    : data;

  const onSelectContact = (id) => {
    const getIndex = tempArr.indexOf(id);
    if (getIndex !== -1) {
      // element found
      tempArr.splice(getIndex, 1);
      setSelectedContacts([...tempArr]);
    } else {
      tempArr.push(id);
      setSelectedContacts([...tempArr]);
    }

    if (filterData.length === tempArr.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  };

  const handleSelectAll = () => {
    tempArr = [];
    if (selectAll) {
      setSelectedContacts([]);
      setSelectAll(false);
      return;
    }
    const arr = [];
    filterData?.map((data) => arr.push(data.id));
    setSelectedContacts([...arr]);
    tempArr = [...arr];
    setSelectAll(true);
  };
  const color = selectAll ? "green" : "gray";

  return (
    <div id="page-content-wrapper">
      <div className="container-fluid">
        <div className="navbar">
          <h3 className=""> All Contacts({data && data.length})</h3>
        </div>
        <Row>
          <Form.Group className="mb-3 ">
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              className="bg-light search-bar"
              placeholder="Search Contacts"
            />
          </Form.Group>

          {length === 0 ? (
            <h3 className="text-center mt-5">No Record Found</h3>
          ) : null}
          <InfiniteScroll
            next={nextPage}
            hasMore={true}
            dataLength={filterData.length}
          >
            <div onClick={handleSelectAll} className="select-div">
              {filterData.length > 0 && (
                <span className="pointer">
                  <AiFillCheckCircle style={{ color, marginRight: "10px" }} />
                  {selectAll ? "Unselect All" : "Select All"}
                </span>
              )}
            </div>
            {filterData &&
              filterData.map((value) => (
                <div style={{ display: "flex" }}>
                  <div class="icon">
                    <AiFillCheckCircle
                      style={
                        selectedContacts.includes(value.id)
                          ? { color: "green" }
                          : { color: "gray" }
                      }
                    />
                  </div>
                  <div
                    className="contact-row pointer"
                    onClick={() => onSelectContact(value.id)}
                  >
                    <div className="contact-image">
                      <img className="image" src={ImageUrl} alt="" />
                    </div>
                    <p className="contact-name">{value.name}</p>
                    <p className="contact-number">{value.phoneNumber}</p>
                  </div>
                </div>
              ))}
          </InfiniteScroll>
        </Row>
      </div>
    </div>
  );
};

export default Main;
