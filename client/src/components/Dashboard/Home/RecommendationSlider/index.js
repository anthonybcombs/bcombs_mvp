import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";

import Img1 from "../../../../images/img1.jpg";
import Img2 from "../../../../images/img2.jpg";
import Img3 from "../../../../images/img3.jpg";

const RecommendationSliderStyled = styled.div`

  scroll-behavior: smooth;  
  overflow-x: hidden; 
  overflow-y: hidden; 
  position: relative;
  .table-container {
    white-space: nowrap;
    width: 100%;
    max-width: 816px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
  }

  .card {
    margin: 5px;
    padding: 5px;
    box-shadow: 0px 3px 6px #908e8e;
  }

  .card .body {
    margin: 10px;
  }

  .card .body > div {
    margin-bottom: 10px;
  }

  .card .category {
    color: #f26e21;
    font-weight: 500;
    white-space: normal !important;
    word-break: break-all !important;
  }

  .card .title {
    font-weight: 500;
    white-space: normal !important;
    word-break: break-all !important;
  }

  .card .message {
    white-space: normal !important;
    word-break: break-all !important;
  }

  .card .header {
    width: 252px;
    height: 146px;
  }

  .card .header img {
    width: 100%;
    height: 100%;
  }
`;

export default function index({scrollValue}) {

  const recommendations = [{
    img: Img1,
    title: "ELIJAH BLAND (R&B/Vocalist)",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mi quis hendrerit dolor magna eget est lorem ipsum dolor. Congue eu consequat ac felis. Fames ac turpis egestas integer eget aliquet. Velit laoreet id donec ultrices tincidunt arcu. Interdum consectetur libero id faucibus. Sed tempus urna et pharetra pharetra massa massa ultricies",
    category: "Entertainment"
  },{
    img: Img2,
    title: "Duke vs Virginia",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mi quis hendrerit dolor magna eget est lorem ipsum dolor. Congue eu consequat ac felis. Fames ac turpis egestas integer eget aliquet. Velit laoreet id donec ultrices tincidunt arcu. Interdum consectetur libero id faucibus. Sed tempus urna et pharetra pharetra massa massa ultricies",
    category: "Sports"
  },{
    img: Img3,
    title: "ELIJAH BLAND (R&B/Vocalist)",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mi quis hendrerit dolor magna eget est lorem ipsum dolor. Congue eu consequat ac felis. Fames ac turpis egestas integer eget aliquet. Velit laoreet id donec ultrices tincidunt arcu. Interdum consectetur libero id faucibus. Sed tempus urna et pharetra pharetra massa massa ultricies",
    category: "Entertainment"
  },{
    img: Img1,
    title: "ELIJAH BLAND (R&B/Vocalist)",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mi quis hendrerit dolor magna eget est lorem ipsum dolor. Congue eu consequat ac felis. Fames ac turpis egestas integer eget aliquet. Velit laoreet id donec ultrices tincidunt arcu. Interdum consectetur libero id faucibus. Sed tempus urna et pharetra pharetra massa massa ultricies",
    category: "Entertainment"
  },{
    img: Img2,
    title: "Duke vs Virginia",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mi quis hendrerit dolor magna eget est lorem ipsum dolor. Congue eu consequat ac felis. Fames ac turpis egestas integer eget aliquet. Velit laoreet id donec ultrices tincidunt arcu. Interdum consectetur libero id faucibus. Sed tempus urna et pharetra pharetra massa massa ultricies",
    category: "Sports"
  },{
    img: Img3,
    title: "ELIJAH BLAND (R&B/Vocalist)",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mi quis hendrerit dolor magna eget est lorem ipsum dolor. Congue eu consequat ac felis. Fames ac turpis egestas integer eget aliquet. Velit laoreet id donec ultrices tincidunt arcu. Interdum consectetur libero id faucibus. Sed tempus urna et pharetra pharetra massa massa ultricies",
    category: "Entertainment"
  },{
    img: Img1,
    title: "ELIJAH BLAND (R&B/Vocalist)",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mi quis hendrerit dolor magna eget est lorem ipsum dolor. Congue eu consequat ac felis. Fames ac turpis egestas integer eget aliquet",
    category: "Entertainment"
  },{
    img: Img2,
    title: "Duke vs Virginia",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mi quis hendrerit dolor magna eget est lorem ipsum dolor. Congue eu consequat ac felis. Fames ac turpis egestas integer eget aliquet",
    category: "Sports"
  },{
    img: Img3,
    title: "ELIJAH BLAND (R&B/Vocalist)",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mi quis hendrerit dolor magna eget est lorem ipsum dolor. Congue eu consequat ac felis. Fames ac turpis egestas integer eget aliquet",
    category: "Entertainment"
  },{
    img: Img1,
    title: "ELIJAH BLAND (R&B/Vocalist)",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mi quis hendrerit dolor magna eget est lorem ipsum dolor. Congue eu consequat ac felis. Fames ac turpis egestas integer eget aliquet",
    category: "Entertainment"
  }];

  const recRef = useRef(null);

  const scrollToRef = (ref) => {
    if(ref && ref.current != null && ref.current.childNodes[0].childNodes[0]) {
      let scrollWidth = ref.current.scrollWidth;
      let childWidth = ref.current.childNodes[0].childNodes[0].offsetWidth ;

      console.log("REF REF", ref);
      console.log("childWidth", childWidth);

      console.log("Scroll Value", scrollValue);
      if(scrollValue > 0)
        ref.current.scrollLeft = (childWidth + 10) * scrollValue;
      else
        ref.current.scrollLeft = 0;
    }
  }

  let rows = [];

  for(let recommendation of recommendations) {
    rows.push((
      <div className="card">
        <div className="header">
          <img src={recommendation.img}/>
        </div>
        <div className="body">
          <div className="category">{recommendation.category}</div>
          <div className="title">{recommendation.title}</div>
          <div className="message">{recommendation.text}</div>
        </div>
      </div>
    ))
  }

  scrollToRef(recRef);

  return (
    <RecommendationSliderStyled ref={recRef}>
      <div className="table-container">
        {rows}
      </div>
    </RecommendationSliderStyled>
  )
}